from firebase_functions import https_fn, options
import json
from routes.shared import ALLOWED_ORIGINS, verify_auth, error_response
from universal_match_engine import BirthInput, EngineConfig
from universal_match_engine.feature_extractor import vectorize
from universal_match_engine.zone_scorer import get_zone_for_placement, compute_zone_compatibility_score

SIGNS=["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"]
def lon_to_sign(l): return SIGNS[int((float(l)%360)//30)]

def _birth(b):
    return BirthInput(
        birth_date=b["birthDate"], birth_time=b["birthTime"],
        latitude=float(b["latitude"]), longitude=float(b["longitude"]),
        timezone=b.get("timezone","UTC")
    )

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=["POST"]),
    memory=options.MemoryOption.GB_1,
    timeout_sec=180,
)
def compatibility_zone_debug_pair(req: https_fn.Request) -> https_fn.Response:
    try:
        if req.method != "POST":
            return https_fn.Response(json.dumps({"error":"Method not allowed"}), status=405)
        _, err = verify_auth(req)
        if err: return err
        body = req.get_json() or {}
        a = body.get("profileA")
        b = body.get("profileB")
        if not a or not b:
            return https_fn.Response(json.dumps({"error":"Missing profileA/profileB"}), status=400)

        pa = vectorize(user_id=a.get("profileId","A"), b=_birth(a["birth"]), psych=a.get("psych",{}))
        pb = vectorize(user_id=b.get("profileId","B"), b=_birth(b["birth"]), psych=b.get("psych",{}))

        keys=["sun","moon","asc","mercury","venus","mars","jupiter","saturn"]
        us={}; cs={}; ud={}; cd={}; rows=[]
        for k in keys:
            if k=="asc":
                ul=pa.features.get("asc_lon"); cl=pb.features.get("asc_lon")
                udeg=float(pa.features.get("asc_degree_in_sign",0.0)); cdeg=float(pb.features.get("asc_degree_in_sign",0.0))
            else:
                ul=pa.features.get(f"{k}_lon"); cl=pb.features.get(f"{k}_lon")
                udeg=float(pa.features.get(f"{k}_degree_in_sign",0.0)); cdeg=float(pb.features.get(f"{k}_degree_in_sign",0.0))
            if ul is None or cl is None: continue
            us[k]=lon_to_sign(ul); cs[k]=lon_to_sign(cl); ud[k]=udeg; cd[k]=cdeg
            rows.append({
                "placement": k,
                "aSign": us[k], "aDegree": round(udeg,2), "aZone": get_zone_for_placement(us[k], udeg),
                "bSign": cs[k], "bDegree": round(cdeg,2), "bZone": get_zone_for_placement(cs[k], cdeg)
            })

        zone_score = compute_zone_compatibility_score(us, ud, cs, cd)

        return https_fn.Response(json.dumps({
            "ok": True,
            "pair": {"a": pa.user_id, "b": pb.user_id},
            "zoneScore": round(zone_score,4),
            "placements": rows,
        }), status=200, headers={"Content-Type":"application/json"})
    except Exception as e:
        return error_response(e)
