path = r'c:\Users\Jaswanth Reddy\OneDrive\Desktop\Projects\Algoscope\frontend\src\data\problems.json'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in [158, 271, 384]:
    line = lines[i]
    print(f"Index {i}: {repr(line)}")
    print(f"Hex: {' '.join(f'{ord(c):04x}' for c in line)}")
    print("-" * 20)
