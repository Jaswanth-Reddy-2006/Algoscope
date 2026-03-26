import json

path = r'c:\Users\Jaswanth Reddy\OneDrive\Desktop\Projects\Algoscope\frontend\src\data\problems.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# IDs to standardize
standardize_ids = [11, 20, 33, 48, 49, 53, 55, 56, 70, 74]

# New schema mapping (approximate for general ones)
schema_overrides = {
    11: {"brute": {"time": "O(N²)", "space": "O(1)"}, "optimal": {"time": "O(N)", "space": "O(1)"}},
    20: {"brute": {"time": "O(2^N)", "space": "O(2^N)"}, "optimal": {"time": "O(N)", "space": "O(N)"}},
    33: {"brute": {"time": "O(N)", "space": "O(1)"}, "optimal": {"time": "O(log N)", "space": "O(1)"}},
    48: {"brute": {"time": "O(N²)", "space": "O(N²)"}, "optimal": {"time": "O(N²)", "space": "O(1)"}},
    49: {"brute": {"time": "O(N*M²)", "space": "O(N*M)"}, "optimal": {"time": "O(N*M log M)", "space": "O(N*M)"}},
    53: {"brute": {"time": "O(N²)", "space": "O(1)"}, "optimal": {"time": "O(N)", "space": "O(1)"}},
    55: {"brute": {"time": "O(2^N)", "space": "O(N)"}, "optimal": {"time": "O(N)", "space": "O(1)"}},
    56: {"brute": {"time": "O(N²)", "space": "O(N)"}, "optimal": {"time": "O(N log N)", "space": "O(N)"}},
    70: {"brute": {"time": "O(2^N)", "space": "O(N)"}, "optimal": {"time": "O(N)", "space": "O(1)"}},
    74: {"brute": {"time": "O(N*M)", "space": "O(1)"}, "optimal": {"time": "O(log(N*M))", "space": "O(1)"}},
}

for problem in data:
    if problem['id'] in schema_overrides:
        problem['complexity'] = schema_overrides[problem['id']]

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=True)
