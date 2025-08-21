import os, sys

PATH: str = "music/"

"""
musicFiles = [ // javascript example
    "music/balls.ogg
]
"""

output = []
for filename in os.listdir(PATH):
    output.append(f'"{PATH}{filename}"')

outStr: str = f"""
musicFiles = [
    {",\n\t".join(output)}
]
"""

with open("musicFiles.js", "w") as f:
    f.write(outStr)