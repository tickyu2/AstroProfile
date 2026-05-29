from firebase_functions import https_fn, options
import json
from routes.shared import ALLOWED_ORIGINS, verify_auth, error_response
from universal_match_engine import EngineConfig, BirthInput
from universal_match_engine.feature_extractor import vectorize
from universal_match_engine.scorer import score_pair


def _birth_from_payload(b):
    return BirthInput(
        birth_date=b["birthDate"],
        birth_time=b["birthTime"],
        latitude=float(b["latitude"]),
        longitude=float(b["longitude"]),
        timezone=b.get("timezone", "UTC"),
    )


def _narrative(explain: dict, reasons: list[str]) -> str:
    parts = []
    parts.append(f"Overall compatibility score: {round(explain.get('weighted_score', 0)*100, 1)}/100 before shortlist blend.")
    parts.append(
        f"Core signs: Sun {explain.get('sun_comp',0):.2f}, Moon {explain.get('moon_comp',0):.2f}, Rising {explain.get('rising_comp',0):.2f}."
    )
    parts.append(
        f"Mechanics: Angles {explain.get('angle_dynamics_score',0):.2f}, Houses {explain.get('house_placement_score',0):.2f}, Rulership {explain.get('rulership_network_score',0):.2f}."
    )
    parts.append(
        f"Symbolic layer: Degree theory {explain.get('degree_theory_score',0):.2f}, Sabian resonance {explain.get('sabian_resonance_score',0):.2f}."
    )
    if reasons:
        parts.append("Top reasons: " + "; ".join(reasons[:5]))
    return " ".join(parts)


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=["POST"]),
    memory=options.MemoryOption.GB_1,
    timeout_sec=240,
)
def compatibility_explain_pair(req: https_fn.Request) -> https_fn.Response:
    try:
        if req.method != "POST":
            return https_fn.Response(json.dumps({"error": "Method not allowed"}), status=405)

        user, err = verify_auth(req)
        if err:
            return err

        body = req.get_json() or {}
        a = body.get("profileA")
        b = body.get("profileB")
        if not a or not b:
            return https_fn.Response(json.dumps({"error": "Missing profileA/profileB"}), status=400)

        cfg = EngineConfig()

        pa = vectorize(
            user_id=a.get("profileId", "A"),
            b=_birth_from_payload(a["birth"]),
            psych=a.get("psych", {}),
        )
        pb = vectorize(
            user_id=b.get("profileId", "B"),
            b=_birth_from_payload(b["birth"]),
            psych=b.get("psych", {}),
        )

        # direct pair explain (base_similarity neutral=0.5)
        m = score_pair(
            cfg=cfg,
            user_id=pa.user_id,
            candidate_id=pb.user_id,
            base_similarity=0.5,
            user_tags=pa.archetype_tags,
            cand_tags=pb.archetype_tags,
            psych_user=a.get("psych", {}),
            psych_cand=b.get("psych", {}),
            user_features=pa.features,
            cand_features=pb.features,
        )

        narrative = _narrative(m.explain, m.reasons)

        return https_fn.Response(
            json.dumps({
                "ok": True,
                "pair": {"a": pa.user_id, "b": pb.user_id},
                "score": m.total_score,
                "reasons": m.reasons,
                "explain": m.explain,
                "narrative": narrative,
            }),
            status=200,
            headers={"Content-Type": "application/json"},
        )

    except Exception as e:
        return error_response(e)
