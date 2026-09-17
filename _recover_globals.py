import json
import re
from pathlib import Path

TRANSCRIPT = Path(
    r"C:\Users\amir\.cursor\projects\d-dastyar-moallem\agent-transcripts\28e72d81-c41d-40c1-a53d-a0bd1ffdbef1\28e72d81-c41d-40c1-a53d-a0bd1ffdbef1.jsonl"
)
OUT = Path(r"d:\dastyar-moallem\app\globals.css")
STANDARD = OUT.read_text(encoding="utf-8")

def is_globals_path(p: str) -> bool:
    return p.replace("/", "\\").endswith(r"app\globals.css")

def extract_ops():
    ops = []
    for line_no, line in enumerate(TRANSCRIPT.read_text(encoding="utf-8").splitlines(), 1):
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        msg = obj.get("message", {})
        content = msg.get("content", [])
        if not isinstance(content, list):
            continue
        for item in content:
            if item.get("type") != "tool_use":
                continue
            name = item.get("name")
            if name not in ("StrReplace", "Write"):
                continue
            inp = item.get("input", {})
            if not is_globals_path(inp.get("path", "")):
                continue
            ops.append((line_no, name, inp))
    return ops

def find_initial_from_reads():
    """Find earliest full-ish globals.css from Read tool outputs in transcript."""
    best = None
    best_len = 0
    for line in TRANSCRIPT.read_text(encoding="utf-8").splitlines():
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        msg = obj.get("message", {})
        content = msg.get("content", [])
        if isinstance(content, str):
            content = [{"type": "text", "text": content}]
        for item in content:
            t = item.get("text", "") if item.get("type") == "text" else ""
            # Read tool output format: line numbers like "     1|@import"
            if "globals.css" not in t:
                continue
            if not re.search(r"^\s*\d+\|", t, re.M):
                continue
            lines = []
            for m in re.finditer(r"^\s*\d+\|(.*)$", t, re.M):
                lines.append(m.group(1))
            body = "\n".join(lines)
            if len(body) > best_len and ("@import" in body or ":root" in body):
                best = body
                best_len = len(body)
    return best

def apply_ops(content: str, ops) -> tuple[str, list]:
    log = []
    for line_no, name, inp in ops:
        if name == "Write":
            content = inp.get("contents", "")
            log.append(f"L{line_no} Write (len={len(content)})")
            continue
        old = inp.get("old_string", "")
        new = inp.get("new_string", "")
        if old not in content:
            log.append(f"L{line_no} SKIP (old_string not found, old_len={len(old)})")
            continue
        content = content.replace(old, new, 1)
        log.append(f"L{line_no} OK StrReplace (old={len(old)} new={len(new)})")
    return content, log

def main():
    ops = extract_ops()
    print(f"Operations: {len(ops)}")

    initial = find_initial_from_reads()
    if initial:
        print(f"Initial from Read: {len(initial)} chars, {initial.count(chr(10))+1} lines")
    else:
        print("No Read snapshot found")
        initial = ""

    # Try applying from Read snapshot (before first patch at L34)
    if initial:
        content, log = apply_ops(initial, ops)
        failed = sum(1 for x in log if "SKIP" in x)
        print(f"From Read: applied {len(log)-failed}/{len(log)}, final len={len(content)}")
        if failed:
            print("First 10 skips:")
            for x in log:
                if "SKIP" in x:
                    print(" ", x)
                    failed -= 1
                    if failed <= 0:
                        break

    # Also try: reconstruct base from first patch old_strings chained backward - use earliest read only

    # Best approach: use LAST successful read before overwrite if any
    # Search all reads with offset and pick largest after all patches
    last_reads = []
    line_text = TRANSCRIPT.read_text(encoding="utf-8").splitlines()
    for idx, line in enumerate(line_text):
        if "globals.css" not in line:
            continue
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        # user/tool result lines often follow assistant Read
        pass

    # Find maximum read snapshot in entire transcript (likely post-patch state)
    all_reads = []
    for line_no, line in enumerate(line_text, 1):
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        msg = obj.get("message", {})
        content = msg.get("content", [])
        if isinstance(content, str):
            content = [{"type": "text", "text": content}]
        for item in content:
            t = item.get("text", "") if item.get("type") == "text" else ""
            if not re.search(r"^\s*\d+\|", t, re.M):
                continue
            if ":root" not in t and "@import" not in t and ".tiptap" not in t and ".home-header" not in t:
                continue
            # must look like globals.css not other files
            if "standard-exam" in t and "@import" not in t and ":root" not in t:
                if t.count("standard-exam") > 5:
                    continue
            lines = []
            for m in re.finditer(r"^\s*\d+\|(.*)$", t, re.M):
                lines.append(m.group(1))
            body = "\n".join(lines)
            if len(body) > 500:
                all_reads.append((line_no, len(body), body))

    all_reads.sort(key=lambda x: x[1], reverse=True)
    print(f"\nFound {len(all_reads)} read-like snapshots")
    for ln, lnlen, _ in all_reads[:5]:
        print(f"  L{ln}: {lnlen} chars")

    if all_reads:
        # Take largest snapshot and apply only ops AFTER that line
        snap_line, snap_len, snap = all_reads[0]
        later_ops = [o for o in ops if o[0] > snap_line]
        print(f"\nLargest snapshot L{snap_line} ({snap_len}), applying {len(later_ops)} later ops")
        content2, log2 = apply_ops(snap, later_ops)
        failed2 = [x for x in log2 if "SKIP" in x]
        print(f"Result: {len(content2)} chars, skips={len(failed2)}")
        for x in failed2[:15]:
            print(" ", x)

        # Full replay: start from earliest read before L34
        early = min(all_reads, key=lambda x: x[0])
        if early[0] < 34:
            content3, log3 = apply_ops(early[2], ops)
            failed3 = [x for x in log3 if "SKIP" in x]
            print(f"\nFrom earliest L{early[0]} ({early[1]}), full replay: {len(content3)} chars, skips={len(failed3)}")
            if len(failed3) < len(failed2):
                content2 = content3
                print("Using full replay result")

        # Append standard exam section
        std_start = STANDARD.find("/* ===== تم آزمون استاندارد")
        standard_section = STANDARD[std_start:] if std_start >= 0 else STANDARD

        if "standard-exam-page" not in content2:
            content2 = content2.rstrip() + "\n\n" + standard_section.lstrip() + "\n"

        OUT.write_text(content2, encoding="utf-8")
        print(f"\nWrote {OUT} ({len(content2)} chars, {content2.count(chr(10))+1} lines)")

if __name__ == "__main__":
    main()
