from typing import Dict, List
import swisseph as swe
from .models import BirthInput, ProfileVector
from .degree_theory import degree_features_for_lon
from .sabian import sabian_features_for_lon

SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"]
PLANETS = {
    "sun": swe.SUN,
    "moon": swe.MOON,
    "mercury": swe.MERCURY,
    "venus": swe.VENUS,
    "mars": swe.MARS,
    "jupiter": swe.JUPITER,
    "saturn": swe.SATURN,
}
RULER = {
    "Aries": "mars", "Taurus": "venus", "Gemini": "mercury", "Cancer": "moon",
    "Leo": "sun", "Virgo": "mercury", "Libra": "venus", "Scorpio": "mars",
    "Sagittarius": "jupiter", "Capricorn": "saturn", "Aquarius": "saturn", "Pisces": "jupiter",
}

def _sign(lon: float) -> str:
    return SIGNS[int((lon % 360) // 30)]

def _onehot(s: str) -> List[float]:
    return [1.0 if x == s else 0.0 for x in SIGNS]

def _in_arc(lon: float, start: float, end: float) -> bool:
    lon %= 360; start %= 360; end %= 360
    if start <= end:
        return start <= lon < end
    return lon >= start or lon < end

def _house_of(lon: float, cusps: List[float]) -> int:
    for i in range(12):
        if _in_arc(lon, cusps[i], cusps[(i + 1) % 12]):
            return i + 1
    return 1

def vectorize(user_id: str, b: BirthInput, psych: Dict[str, float] | None = None) -> ProfileVector:
    psych = psych or {}
    y, m, d = [int(x) for x in b.birth_date.split('-')]
    hh, mm = [int(x) for x in b.birth_time.split(':')]
    jd = swe.julday(y, m, d, hh + mm / 60.0)

    feats: Dict[str, float] = {}
    signs: Dict[str, str] = {}

    for n, pid in PLANETS.items():
        vals, _ = swe.calc_ut(jd, pid, swe.FLG_SPEED)
        lon = float(vals[0]); speed = float(vals[3])
        feats[f"{n}_lon"] = lon
        feats[f"{n}_retro"] = 1.0 if speed < 0 else 0.0
        signs[f"{n}_sign"] = _sign(lon)

    cusps, ascmc = swe.houses(jd, b.latitude, b.longitude)
    cusp = [float(x) for x in cusps]
    asc = float(ascmc[0]); mc = float(ascmc[1]); dsc = (asc + 180.0) % 360.0; ic = (mc + 180.0) % 360.0
    feats["asc_lon"] = asc; feats["mc_lon"] = mc; feats["dsc_lon"] = dsc; feats["ic_lon"] = ic
    signs["rising_sign"] = _sign(asc)

    for p in PLANETS.keys():
        feats[f"{p}_house"] = float(_house_of(feats[f"{p}_lon"], cusp))

    house_signs = {1: _sign(cusp[0]), 4: _sign(cusp[3]), 7: _sign(cusp[6]), 10: _sign(cusp[9])}
    keys = list(PLANETS.keys())
    for h, s in house_signs.items():
        rp = RULER[s]
        feats[f"ruler_h{h}_planet_idx"] = float(keys.index(rp))
        feats[f"ruler_h{h}_lon"] = feats[f"{rp}_lon"]
        feats[f"ruler_h{h}_house"] = feats[f"{rp}_house"]

    # Degree theory + Sabian features
    for k in ["sun","moon","mercury","venus","mars","jupiter","saturn"]:
        feats.update(degree_features_for_lon(k, feats[f"{k}_lon"]))
        feats.update(sabian_features_for_lon(k, feats[f"{k}_lon"]))
    feats.update(degree_features_for_lon("asc", feats["asc_lon"]))
    feats.update(sabian_features_for_lon("asc", feats["asc_lon"]))

    element_map = {
        "Aries":"Fire","Leo":"Fire","Sagittarius":"Fire","Taurus":"Earth","Virgo":"Earth","Capricorn":"Earth",
        "Gemini":"Air","Libra":"Air","Aquarius":"Air","Cancer":"Water","Scorpio":"Water","Pisces":"Water",
    }
    modality_map = {
        "Aries":"Cardinal","Cancer":"Cardinal","Libra":"Cardinal","Capricorn":"Cardinal",
        "Taurus":"Fixed","Leo":"Fixed","Scorpio":"Fixed","Aquarius":"Fixed",
        "Gemini":"Mutable","Virgo":"Mutable","Sagittarius":"Mutable","Pisces":"Mutable",
    }
    elem = {"Fire":0, "Earth":0, "Air":0, "Water":0}
    mod = {"Cardinal":0, "Fixed":0, "Mutable":0}
    for p in PLANETS.keys():
        s = signs[f"{p}_sign"]; elem[element_map[s]] += 1; mod[modality_map[s]] += 1

    v: List[float] = []
    v += _onehot(signs["sun_sign"]) + _onehot(signs["moon_sign"]) + _onehot(signs["rising_sign"])
    for p in ["sun","moon","mercury","venus","mars","jupiter","saturn"]:
        v.append((feats[f"{p}_lon"] % 360.0) / 360.0)
    for a in ["asc_lon","mc_lon","dsc_lon","ic_lon"]:
        v.append((feats[a] % 360.0) / 360.0)
    for p in ["sun","moon","mercury","venus","mars","jupiter","saturn"]:
        v.append((feats[f"{p}_house"] - 1.0) / 11.0)
    for k in ["Fire","Earth","Air","Water"]:
        v.append(elem[k] / 7.0)
    for k in ["Cardinal","Fixed","Mutable"]:
        v.append(mod[k] / 7.0)
    for k in ["openness","conscientiousness","extraversion","agreeableness","neuroticism"]:
        v.append(float(psych.get(k, 0.5)))

    # compact degree/sabian encoding
    for k in ["sun","moon","venus","mars","asc"]:
        v.append((feats[f"{k}_deg"] % 30.0) / 30.0)
        v.append((feats[f"{k}_decan"] % 3.0) / 2.0)
        v.append(feats[f"{k}_critical"])
        v.append((feats[f"{k}_sabian_cluster"] % 10.0) / 9.0)

    tags = [f"sun:{signs['sun_sign']}", f"moon:{signs['moon_sign']}", f"rising:{signs['rising_sign']}"]
    return ProfileVector(user_id=user_id, vector=v, features=feats, archetype_tags=tags)
