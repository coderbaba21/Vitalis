import requests, time, sys

time.sleep(3)

try:
    r = requests.get('http://127.0.0.1:8000/api/health', timeout=6)
    print('Backend:', r.status_code)
except Exception as e:
    print('Backend not ready yet:', e)
    sys.exit(1)

print()
print('=== SMOOTH SCORING VALIDATION (vs expected from user spec) ===')
print()

scenarios = [
    ('All Optimal (Sleep 7.8h, Stress 3, Act 65m, HR 60)',    7.8, 3, 65,  60,  '~96.5%'),
    ('Stress nudge: 3->5, others unchanged',                   7.8, 5, 65,  60,  '~91.5%'),
    ('Sleep slightly low: 6.8h, rest same',                    6.8, 3, 65,  60,  '~92.0%'),
    ('Overtraining: Act 115m, rest optimal',                   7.8, 3, 115, 60,  '~89.8%'),
    ('Multiple bad vitals: Sleep5h Stress8 HR80',              5.0, 8, 35,  80,  '~42.5%'),
    ('Worst extremes: Sleep4h Stress10 HR95',                  4.0, 10, 20, 95,  '~18.0%'),
]

for label, sl, st, ac, hr, expected in scenarios:
    payload = {
        'sleep_hours': sl, 'stress_index': st,
        'activity_mins': float(ac), 'resting_heart_rate': float(hr)
    }
    r2 = requests.post('http://127.0.0.1:8000/api/predict', json=payload, timeout=5)
    d = r2.json()
    pct = d['readiness_percentage']
    state = d['readiness_state']
    brk = d.get('penalty_breakdown', {})
    sp = brk.get('sleep_penalty', 0)
    stp = brk.get('stress_penalty', 0)
    hrp = brk.get('hr_penalty', 0)
    ap = brk.get('activity_penalty', 0)
    print(f"  {pct:5.1f}% [{state:<15s}]  {label}")
    print(f"           Expected: {expected}  | Penalties: sleep={sp:.1f} stress={stp:.1f} hr={hrp:.1f} act={ap:.1f}")
    print()
