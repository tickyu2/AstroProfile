from firebase_functions import https_fn, options
import json
from routes.shared import ALLOWED_ORIGINS, verify_auth, error_response
from universal_match_engine import EngineConfig, UniversalCompatibilityEngine, BirthInput

@https_fn.on_request(cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=['GET']))
def compatibility_engine_status(req: https_fn.Request) -> https_fn.Response:
    try:
        return https_fn.Response(json.dumps({'ok':True,'engine':'universal-compatibility-engine'}),status=200,headers={'Content-Type':'application/json'})
    except Exception as e:
        return error_response(e)

@https_fn.on_request(cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=['POST']), timeout_sec=240)
def compatibility_upsert_profile(req: https_fn.Request) -> https_fn.Response:
    try:
        user, err = verify_auth(req)
        if err: return err
        body=req.get_json(); user_id=body.get('userId') or user['uid']; b=body['birth']; psych=body.get('psych',{})
        eng=UniversalCompatibilityEngine(EngineConfig()); eng.ensure_schema()
        p=eng.upsert_user_profile(user_id, BirthInput(birth_date=b['birthDate'],birth_time=b['birthTime'],latitude=float(b['latitude']),longitude=float(b['longitude']),timezone=b.get('timezone','UTC')), psych)
        return https_fn.Response(json.dumps({'ok':True,'userId':user_id,'tags':p.archetype_tags,'vectorDim':len(p.vector)}),status=200,headers={'Content-Type':'application/json'})
    except Exception as e:
        return error_response(e)

@https_fn.on_request(cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=['POST']), timeout_sec=300)
def compatibility_match_user(req: https_fn.Request) -> https_fn.Response:
    try:
        user, err = verify_auth(req)
        if err: return err
        body=req.get_json(); user_id=body.get('userId') or user['uid']; b=body['birth']; psych=body.get('psych',{})
        eng=UniversalCompatibilityEngine(EngineConfig()); eng.ensure_schema()
        matches=eng.match_user(user_id, BirthInput(birth_date=b['birthDate'],birth_time=b['birthTime'],latitude=float(b['latitude']),longitude=float(b['longitude']),timezone=b.get('timezone','UTC')), psych)
        return https_fn.Response(json.dumps({'ok':True,'userId':user_id,'count':len(matches),'matches':[{'candidateId':m.candidate_id,'score':m.total_score,'reasons':m.reasons,'explain':m.explain} for m in matches]}),status=200,headers={'Content-Type':'application/json'})
    except Exception as e:
        return error_response(e)
