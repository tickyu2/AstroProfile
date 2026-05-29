"""Opt-in endpoints for universal matchmaking."""
from firebase_functions import https_fn, options
import json
from firebase_admin import firestore
from routes.shared import ALLOWED_ORIGINS, verify_auth, error_response


def _ok(data):
    return https_fn.Response(json.dumps(data), status=200, headers={"Content-Type": "application/json"})


@https_fn.on_request(cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=["POST"]))
def match_opt_in(req: https_fn.Request) -> https_fn.Response:
    try:
        user, err = verify_auth(req)
        if err: return err
        body = req.get_json() or {}
        profile_id = body.get("profileId")
        if not profile_id:
            return https_fn.Response(json.dumps({"error": "Missing profileId"}), status=400)

        db = firestore.client()
        ref = db.collection("profiles").document(profile_id)
        snap = ref.get()
        if not snap.exists:
            return https_fn.Response(json.dumps({"error": "Profile not found"}), status=404)

        data = snap.to_dict() or {}
        if data.get("ownerUserId") != user["uid"]:
            return https_fn.Response(json.dumps({"error": "Forbidden"}), status=403)

        patch = {
            "matchOptIn": True,
            "matchSettings": body.get("matchSettings", data.get("matchSettings", {
                "visibility": "global",
                "allowedMatchTypes": ["friend"],
                "minScoreToNotify": 0.82,
                "mutualOnly": True,
            })),
            "notificationPrefs": body.get("notificationPrefs", data.get("notificationPrefs", {
                "inApp": True,
                "telegram": True,
                "email": False,
                "cooldownHours": 24,
            })),
            "consent": {
                "version": body.get("consentVersion", "v1.0"),
                "acceptedAt": firestore.SERVER_TIMESTAMP,
                "optedInAt": firestore.SERVER_TIMESTAMP,
                "optedOutAt": None,
            },
            "updatedAt": firestore.SERVER_TIMESTAMP,
        }
        ref.set(patch, merge=True)

        # enqueue match run
        db.collection("match_queue").add({
            "profileId": profile_id,
            "runType": "initial",
            "status": "queued",
            "createdAt": firestore.SERVER_TIMESTAMP,
        })

        return _ok({"ok": True, "profileId": profile_id, "matchOptIn": True})
    except Exception as e:
        return error_response(e)


@https_fn.on_request(cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=["POST"]))
def match_opt_out(req: https_fn.Request) -> https_fn.Response:
    try:
        user, err = verify_auth(req)
        if err: return err
        body = req.get_json() or {}
        profile_id = body.get("profileId")
        if not profile_id:
            return https_fn.Response(json.dumps({"error": "Missing profileId"}), status=400)

        db = firestore.client()
        ref = db.collection("profiles").document(profile_id)
        snap = ref.get()
        if not snap.exists:
            return https_fn.Response(json.dumps({"error": "Profile not found"}), status=404)

        data = snap.to_dict() or {}
        if data.get("ownerUserId") != user["uid"]:
            return https_fn.Response(json.dumps({"error": "Forbidden"}), status=403)

        ref.set({
            "matchOptIn": False,
            "consent": {"optedOutAt": firestore.SERVER_TIMESTAMP},
            "updatedAt": firestore.SERVER_TIMESTAMP,
        }, merge=True)

        return _ok({"ok": True, "profileId": profile_id, "matchOptIn": False})
    except Exception as e:
        return error_response(e)


@https_fn.on_request(cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=["POST"]))
def match_run_now(req: https_fn.Request) -> https_fn.Response:
    try:
        user, err = verify_auth(req)
        if err: return err
        body = req.get_json() or {}
        profile_id = body.get("profileId")
        if not profile_id:
            return https_fn.Response(json.dumps({"error": "Missing profileId"}), status=400)

        db = firestore.client()
        snap = db.collection("profiles").document(profile_id).get()
        if not snap.exists:
            return https_fn.Response(json.dumps({"error": "Profile not found"}), status=404)
        data = snap.to_dict() or {}
        if data.get("ownerUserId") != user["uid"]:
            return https_fn.Response(json.dumps({"error": "Forbidden"}), status=403)

        db.collection("match_queue").add({
            "profileId": profile_id,
            "runType": "manual",
            "status": "queued",
            "createdAt": firestore.SERVER_TIMESTAMP,
        })
        return _ok({"ok": True, "queued": True, "profileId": profile_id})
    except Exception as e:
        return error_response(e)
