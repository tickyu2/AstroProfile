"""Compatibility scoring (universal + explainable components)."""

from __future__ import annotations
from .config import EngineConfig
from .models import MatchResult
from .degree_theory import pair_degree_resonance
from .sabian import sabian_resonance

ELEMENT = {
    "Aries":"Fire","Leo":"Fire","Sagittarius":"Fire",
    "Taurus":"Earth","Virgo":"Earth","Capricorn":"Earth",
    "Gemini":"Air","Libra":"Air","Aquarius":"Air",
    "Cancer":"Water","Scorpio":"Water","Pisces":"Water",
}


def _extract_sign(tags, key):
    for t in tags:
        if t.startswith(f"{key}:"):
            return t.split(":", 1)[1]
    return "Aries"


def sign_similarity(a: str, b: str) -> float:
    if a == b:
        return 1.0
    if ELEMENT.get(a) == ELEMENT.get(b):
        return 0.75
    return 0.45


def _ang_diff(a: float, b: float) -> float:
    d = abs((a - b) % 360.0)
    return min(d, 360.0 - d)


def _aspect_score(diff: float) -> float:
    targets = [0.0, 60.0, 90.0, 120.0, 180.0]
    best = min(abs(diff - t) for t in targets)
    return max(0.0, min(1.0, 1.0 - (best / 12.0)))


def _soft_aspect_score(diff: float) -> float:
    """Score aspects favouring harmonics (trine/sextile/conjunction) over
    tension aspects (square/opposition). Used for Saturn synastry where
    hard aspects restrict rather than stabilise."""
    harmonics = [(0.0, 0.80), (60.0, 1.00), (120.0, 1.00)]
    tensions   = [(90.0, 0.25), (180.0, 0.35)]
    best = 0.0
    for target, peak in harmonics + tensions:
        d = abs(diff - target)
        if d <= 10.0:
            best = max(best, peak * (1.0 - d / 10.0))
    return best if best > 0.0 else 0.20


def _house_harmony(h1: float, h2: float) -> float:
    d = abs(int(h1) - int(h2)); d = min(d, 12 - d)
    if d == 0: return 1.0
    if d in (1,2): return 0.72
    if d in (3,4): return 0.62
    if d in (5,6): return 0.52
    return 0.45


def _dist_sim(a, b):
    d = sum(abs(x - y) for x, y in zip(a, b))
    return max(0.0, 1.0 - (d / 2.0))


def compute_element_modality_score(user_features=None, cand_features=None) -> float:
    uf = user_features or {}; cf = cand_features or {}
    ue = [float(uf.get('elem_fire', 0.25)), float(uf.get('elem_earth', 0.25)), float(uf.get('elem_air', 0.25)), float(uf.get('elem_water', 0.25))]
    ce = [float(cf.get('elem_fire', 0.25)), float(cf.get('elem_earth', 0.25)), float(cf.get('elem_air', 0.25)), float(cf.get('elem_water', 0.25))]
    um = [float(uf.get('mod_cardinal', 1/3)), float(uf.get('mod_fixed', 1/3)), float(uf.get('mod_mutable', 1/3))]
    cm = [float(cf.get('mod_cardinal', 1/3)), float(cf.get('mod_fixed', 1/3)), float(cf.get('mod_mutable', 1/3))]
    element_harmony = _dist_sim(ue, ce)
    modality_harmony = _dist_sim(um, cm)
    return 0.6 * element_harmony + 0.4 * modality_harmony


def compute_angle_dynamics_score(user_features=None, cand_features=None) -> float:
    uf = user_features or {}; cf = cand_features or {}
    pers = ["sun", "moon", "mercury", "venus", "mars"]
    cand_angles = [cf.get("asc_lon"), cf.get("mc_lon"), cf.get("dsc_lon"), cf.get("ic_lon")]
    user_angles = [uf.get("asc_lon"), uf.get("mc_lon"), uf.get("dsc_lon"), uf.get("ic_lon")]
    vals = []
    for p in pers:
        pl = uf.get(f"{p}_lon")
        if pl is not None:
            for a in cand_angles:
                if a is not None:
                    vals.append(_aspect_score(_ang_diff(float(pl), float(a))))
    for p in pers:
        pl = cf.get(f"{p}_lon")
        if pl is not None:
            for a in user_angles:
                if a is not None:
                    vals.append(_aspect_score(_ang_diff(float(pl), float(a))))
    return sum(vals) / len(vals) if vals else 0.5


def compute_house_placement_score(user_features=None, cand_features=None) -> float:
    uf = user_features or {}; cf = cand_features or {}
    core = []
    for p in ["sun","moon","venus","mars","mercury"]:
        uh = uf.get(f"{p}_house"); ch = cf.get(f"{p}_house")
        if uh is not None and ch is not None:
            core.append(_house_harmony(float(uh), float(ch)))
    rel = []
    for h in [1,4,7,10]:
        ur = uf.get(f"ruler_h{h}_house"); cr = cf.get(f"ruler_h{h}_house")
        if ur is not None and cr is not None:
            rel.append(_house_harmony(float(ur), float(cr)))
    c = sum(core)/len(core) if core else 0.5
    r = sum(rel)/len(rel) if rel else 0.5
    return 0.65*c + 0.35*r


def _ruler_strength(feat: dict, h: int) -> float:
    lon = feat.get(f"ruler_h{h}_lon"); house = feat.get(f"ruler_h{h}_house")
    if lon is None or house is None: return 0.5
    h_i = int(round(float(house)))
    angular = 1.0 if h_i in (1,4,7,10) else 0.7 if h_i in (2,5,8,11) else 0.55
    angle_bonus = 0.0
    for a in [feat.get("asc_lon"), feat.get("mc_lon")]:
        if a is not None:
            d = _ang_diff(float(lon), float(a))
            angle_bonus = max(angle_bonus, max(0.0, (15.0 - d) / 100.0))
    return min(1.0, angular + angle_bonus)


def compute_rulership_network_score(user_features=None, cand_features=None) -> float:
    uf = user_features or {}; cf = cand_features or {}
    pairs = []
    for h in [1,4,7,10]:
        us = _ruler_strength(uf, h); cs = _ruler_strength(cf, h)
        pairs.append(1.0 - abs(us - cs))
        ul = uf.get(f"ruler_h{h}_lon"); cl = cf.get(f"ruler_h{h}_lon")
        if ul is not None and cl is not None:
            pairs.append(_aspect_score(_ang_diff(float(ul), float(cl))))
    return sum(pairs)/len(pairs) if pairs else 0.5


def compute_degree_theory_score(user_features=None, cand_features=None) -> float:
    uf = user_features or {}; cf = cand_features or {}
    keys = ["sun", "moon", "venus", "mars", "asc"]
    vals = []
    for k in keys:
        ud = uf.get(f"{k}_deg"); cd = cf.get(f"{k}_deg")
        if ud is not None and cd is not None:
            vals.append(pair_degree_resonance(float(ud), float(cd)))
        uc = uf.get(f"{k}_critical", 0.0); cc = cf.get(f"{k}_critical", 0.0)
        vals.append(1.0 if (uc == cc) else 0.6)
    return sum(vals)/len(vals) if vals else 0.5


def compute_sabian_resonance_score(user_features=None, cand_features=None) -> float:
    uf = user_features or {}; cf = cand_features or {}
    keys = ["sun", "moon", "venus", "mars", "asc"]
    vals = []
    for k in keys:
        uk = uf.get(f"{k}_sabian_key"); ck = cf.get(f"{k}_sabian_key")
        if uk is not None and ck is not None:
            vals.append(sabian_resonance(int(uk), int(ck)))
    return sum(vals)/len(vals) if vals else 0.5


def score_pair(cfg: EngineConfig, user_id: str, candidate_id: str, base_similarity: float,
               user_tags, cand_tags, psych_user=None, psych_cand=None,
               user_features=None, cand_features=None) -> MatchResult:

    psych_user = psych_user or {}; psych_cand = psych_cand or {}

    u_sun = _extract_sign(user_tags, "sun"); u_moon = _extract_sign(user_tags, "moon"); u_rising = _extract_sign(user_tags, "rising")
    c_sun = _extract_sign(cand_tags, "sun"); c_moon = _extract_sign(cand_tags, "moon"); c_rising = _extract_sign(cand_tags, "rising")

    sun_comp = sign_similarity(u_sun, c_sun)
    moon_comp = sign_similarity(u_moon, c_moon)
    rising_comp = sign_similarity(u_rising, c_rising)

    # ── Helper: longitude → sign name ─────────────────────────────────────
    _SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"]
    def _SIGN_FROM_LON(lon): return _SIGNS[int((lon % 360) // 30)]

    # ── Venus / Mars attraction score ──────────────────────────────────────
    def _venus_mars_score(uf, cf):
        scores = []
        uv = uf.get("venus_lon"); cm_lon = cf.get("mars_lon")
        if uv is not None and cm_lon is not None:
            scores.append(_aspect_score(_ang_diff(float(uv), float(cm_lon))))
        cv = cf.get("venus_lon"); um_lon = uf.get("mars_lon")
        if cv is not None and um_lon is not None:
            scores.append(_aspect_score(_ang_diff(float(cv), float(um_lon))))
        uv_s = _extract_sign(user_tags, "venus") or ("Taurus" if uv is None else _SIGN_FROM_LON(float(uv)))
        cv_s = _extract_sign(cand_tags, "venus") or ("Taurus" if cv is None else _SIGN_FROM_LON(float(cv)))
        scores.append(sign_similarity(uv_s, cv_s))
        um_s = _extract_sign(user_tags, "mars") or ("Aries" if um_lon is None else _SIGN_FROM_LON(float(um_lon)))
        cm_s = _extract_sign(cand_tags, "mars") or ("Aries" if cm_lon is None else _SIGN_FROM_LON(float(cm_lon)))
        scores.append(sign_similarity(um_s, cm_s))
        uv_h = uf.get("venus_house")
        if uv_h is not None: scores.append(1.0 if int(uv_h) in (5, 7, 1) else 0.65)
        return sum(scores) / len(scores) if scores else 0.5

    # ── Mercury / intellectual compatibility score ──────────────────────────
    def _mercury_score(uf, cf):
        scores = []
        um = uf.get("mercury_lon"); cm = cf.get("mercury_lon")
        if um is not None and cm is not None:
            scores.append(_aspect_score(_ang_diff(float(um), float(cm))))
            sign_diff = abs(int(float(um) // 30) - int(float(cm) // 30))
            sign_diff = min(sign_diff, 12 - sign_diff)
            scores.append(1.0 if sign_diff <= 1 else 0.75 if sign_diff == 2 else 0.5)
        us_lon = uf.get("sun_lon"); cm2 = cf.get("mercury_lon")
        if us_lon is not None and cm2 is not None:
            scores.append(_aspect_score(_ang_diff(float(us_lon), float(cm2))))
        cs_lon = cf.get("sun_lon"); um2 = uf.get("mercury_lon")
        if cs_lon is not None and um2 is not None:
            scores.append(_aspect_score(_ang_diff(float(cs_lon), float(um2))))
        um_h = uf.get("mercury_house"); cm_h = cf.get("mercury_house")
        if um_h is not None and cm_h is not None:
            scores.append(_house_harmony(float(um_h), float(cm_h)))
        um_s = _extract_sign(user_tags, "mercury") or ("Gemini" if um is None else _SIGN_FROM_LON(float(um)))
        cm_s = _extract_sign(cand_tags, "mercury") or ("Gemini" if cm is None else _SIGN_FROM_LON(float(cm)))
        scores.append(sign_similarity(um_s, cm_s))
        return sum(scores) / len(scores) if scores else 0.5

    # ── Saturn / long-term stability score ────────────────────────────────
    def _saturn_score(uf, cf):
        scores = []
        us = uf.get("saturn_lon"); cs = cf.get("saturn_lon")
        if us is not None and cs is not None:
            scores.append(_aspect_score(_ang_diff(float(us), float(cs))))
        um_lon = uf.get("moon_lon"); csat = cf.get("saturn_lon")
        if um_lon is not None and csat is not None:
            d = _ang_diff(float(um_lon), float(csat))
            scores.append(max(0.3, _aspect_score(d) - (0.1 if 85 < d < 95 else 0.0)))
        cm_lon = cf.get("moon_lon"); usat = uf.get("saturn_lon")
        if cm_lon is not None and usat is not None:
            d = _ang_diff(float(cm_lon), float(usat))
            scores.append(max(0.3, _aspect_score(d) - (0.1 if 85 < d < 95 else 0.0)))
        us_h = uf.get("saturn_house"); cs_h = cf.get("saturn_house")
        if us_h is not None and cs_h is not None:
            scores.append(((1.0 if int(us_h) in (1,4,7,10) else 0.7) + (1.0 if int(cs_h) in (1,4,7,10) else 0.7)) / 2.0)
        us_s = _extract_sign(user_tags, "saturn") or ("Capricorn" if us is None else _SIGN_FROM_LON(float(us)))
        cs_s = _extract_sign(cand_tags, "saturn") or ("Capricorn" if cs is None else _SIGN_FROM_LON(float(cs)))
        scores.append(sign_similarity(us_s, cs_s))
        return sum(scores) / len(scores) if scores else 0.5

    venus_mars = _venus_mars_score(user_features or {}, cand_features or {})
    merc_intel = _mercury_score(user_features or {}, cand_features or {})
    saturn_stability = _saturn_score(user_features or {}, cand_features or {})

    keys = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"]
    diffs = [abs(float(psych_user.get(k, 0.5)) - float(psych_cand.get(k, 0.5))) for k in keys]
    psych_comp = 1.0 - (sum(diffs) / len(keys))

    ads = compute_angle_dynamics_score(user_features, cand_features)
    hps = compute_house_placement_score(user_features, cand_features)
    rns = compute_rulership_network_score(user_features, cand_features)
    dts = compute_degree_theory_score(user_features, cand_features)
    sbs = compute_sabian_resonance_score(user_features, cand_features)
    ems = compute_element_modality_score(user_features, cand_features)

    core = 0.34 * ((sun_comp + moon_comp + rising_comp) / 3.0)
    score_v2 = (
        core + 0.14 * venus_mars + 0.12 * merc_intel + 0.10 * saturn_stability +
        cfg.w_angles * ads + cfg.w_houses * hps + cfg.w_rulership * rns + 0.10 * psych_comp
    )
    score = 0.78 * score_v2 + cfg.w_degree_theory * dts + cfg.w_sabian * sbs + cfg.w_elements_modality * ems

    total = max(0.0, min(1.0, 0.75 * score + 0.25 * base_similarity))

    reasons = []
    if moon_comp >= 0.75: reasons.append("Strong emotional tempo alignment")
    if sun_comp >= 0.75: reasons.append("High identity/values resonance")
    if rising_comp >= 0.75: reasons.append("Natural social flow")
    if ads >= 0.7: reasons.append("Angle dynamics support stability")
    if hps >= 0.7: reasons.append("House placement synergy")
    if rns >= 0.7: reasons.append("Rulership network coherence")
    if dts >= 0.7: reasons.append("Degree-theory resonance")
    if sbs >= 0.7: reasons.append("Sabian-symbol resonance")
    if ems >= 0.7: reasons.append("Element/modality harmony")

    explain = {
        "base_similarity": round(base_similarity, 4),
        "sun_comp": round(sun_comp, 4), "moon_comp": round(moon_comp, 4), "rising_comp": round(rising_comp, 4),
        "venus_mars_attraction": round(venus_mars, 4), "mercury_intellect": round(merc_intel, 4), "saturn_stability": round(saturn_stability, 4),
        "psych_comp": round(psych_comp, 4),
        "angle_dynamics_score": round(ads, 4), "house_placement_score": round(hps, 4), "rulership_network_score": round(rns, 4),
        "degree_theory_score": round(dts, 4), "sabian_resonance_score": round(sbs, 4), "element_modality_score": round(ems, 4),
        "weighted_score": round(score, 4),
    }

    return MatchResult(user_id=user_id, candidate_id=candidate_id, total_score=round(total, 4), explain=explain,
                      reasons=reasons or ["General compatibility alignment"])
