"use strict";
const slides = [...document.querySelectorAll(".slide")];
let cur = 0,
  toolbarTimer,
  toastTimer;
const promptData = new WeakMap();
const mediaConfig = {
  "cover-01": "",
  "cover-02": "",
  "cover-03": "",
  "opening-video": "",
  "character-reference": "",
  "story-01": "",
  "story-02": "",
  "story-03": "",
  "scene-01": "",
  "scene-02": "",
  "scene-03": "",
  "reveal-full": "",
  "reveal-secret": "",
  "kling-reference-ui": "",
  "kling-video-ui": "",
  "canva-timeline-ui": "",
  "caption-preview": "",
  "festival-poster": "",
  "festival-video": "",
  "video-01": "",
  "video-02": "",
  "video-03": "",
  "video-04": "",
};
// 미디어 파일 경로는 assets/media-config.js에서 지정합니다.
Object.assign(mediaConfig, window.LECTURE_MEDIA || {});
const mediaPosters = window.LECTURE_POSTERS || {};
const svgPaths = {
  film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
  image:
    '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="2"/><path d="m3 17 6-6 4 4 3-3 5 5"/>',
  person: '<circle cx="12" cy="7" r="4"/><path d="M5 21v-3a7 7 0 0 1 14 0v3"/>',
  idea: '<path d="M8 15a7 7 0 1 1 8 0v3H8zM9 22h6M8 18h8"/>',
  screen:
    '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 22h8M12 17v5M6 7h12M6 11h7"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>',
  pen: '<path d="m4 16-1 5 5-1L20 8l-4-4zM13 7l4 4M16 4l2-2 4 4-2 2"/>',
  check:
    '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m7 12 3 3 7-7"/>',
  spark: '<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/>',
  camera:
    '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-4v12l-6-4z"/>',
  search: '<circle cx="10" cy="10" r="7"/><path d="m15 15 7 7"/>',
  wave: '<path d="M2 9c3-5 5 5 8 0s5 5 8 0 4 0 4 0M2 17c3-5 5 5 8 0s5 5 8 0 4 0 4 0"/>',
  school: '<path d="M3 21V8l9-6 9 6v13zM9 21v-7h6v7M6 9h2M16 9h2"/>',
  game: '<path d="M7 6h10c3 0 5 10 4 13-1 3-5-2-6-2H9c-1 0-5 5-6 2C2 16 4 6 7 6zM6 11h5M8.5 8.5v5M16 10h1M18 13h1"/>',
  bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
  heart: '<path d="M12 21 3 12a6 6 0 0 1 9-8 6 6 0 0 1 9 8z"/>',
  map: '<path d="m2 5 7-3 6 3 7-3v17l-7 3-6-3-7 3zM9 2v17M15 5v17"/>',
  loop: '<path d="M4 10a8 8 0 0 1 14-5l3 3M21 2v6h-6M20 14a8 8 0 0 1-14 5l-3-3M3 22v-6h6"/>',
  target:
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  chart: '<path d="M3 3v18h18M6 15l5-5 4 3 6-8"/>',
  escape: '<path d="M13 2H3v20h10M9 12h13m-5-5 5 5-5 5"/>',
  sprout:
    '<path d="M12 22V11M12 14C3 14 2 6 2 6s10-1 10 8M12 11c0-9 10-9 10-9s1 10-10 9"/>',
  copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
  upload: '<path d="M3 16v5h18v-5M12 17V2m-6 6 6-6 6 6"/>',
  edit: '<path d="M3 6h18M3 12h18M3 18h18M7 3v6M16 9v6M10 15v6"/>',
  star: '<path d="m12 2 3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1z"/>',
  smile:
    '<circle cx="12" cy="12" r="9"/><path d="M8 9h.01M16 9h.01M7 14c3 4 7 4 10 0"/>',
  mystery:
    '<circle cx="12" cy="12" r="9"/><path d="M9 8a3 3 0 1 1 5 3c-2 1-2 2-2 3M12 18h.01"/>',
  robot:
    '<rect x="3" y="6" width="18" height="15" rx="3"/><path d="M12 6V2M8 12h.01M16 12h.01M8 17h8"/>',
  sound:
    '<path d="m3 9 5 0 5-5v16l-5-5H3zM17 8c3 3 3 5 0 8M20 5c5 5 5 9 0 14"/>',
};
function icon(name) {
  return `<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true">${svgPaths[name] || svgPaths.spark}</svg>`;
}
function slot(id, label, ratio = "9:16", type = "image") {
  const e = document.createElement("div");
  e.className = "media-slot";
  e.dataset.mediaId = id;
  e.dataset.mediaType = type;
  e.setAttribute("role", "img");
  e.setAttribute("aria-label", `${label} · ${ratio} · 미디어 삽입 자리`);
  e.innerHTML =
    icon(type === "video" ? "play" : type === "ui" ? "screen" : "image") +
    `<span class="slot-id">${id.toUpperCase()}</span><span class="slot-label">${label}</span><span class="slot-ratio">${ratio}</span>`;
  return e;
}
function insertSlot(parent, id, label, ratio = "9:16", type = "image") {
  const e = slot(id, label, ratio, type);
  parent.append(e);
  return e;
}
function toast(message) {
  const e = document.querySelector(".toast");
  clearTimeout(toastTimer);
  e.textContent = message;
  e.classList.add("show");
  toastTimer = setTimeout(() => e.classList.remove("show"), 2200);
}
function fit() {
  document.querySelector(".deck").style.transform =
    `scale(${Math.min(innerWidth / 1600, innerHeight / 900)})`;
}
function revealToolbar() {
  const bar = document.querySelector(".toolbar");
  bar.classList.remove("is-hidden");
  clearTimeout(toolbarTimer);
  toolbarTimer = setTimeout(() => {
    if (!bar.matches(":hover,:focus-within")) bar.classList.add("is-hidden");
  }, 2400);
}
function show(n) {
  const previous = slides[cur];
  if (previous) previous.querySelectorAll("video").forEach((v) => v.pause());
  cur = Math.max(0, Math.min(slides.length - 1, n));
  slides.forEach((s, i) => {
    s.classList.toggle("active", i === cur);
    s.setAttribute("aria-hidden", String(i !== cur));
  });
  const active = slides[cur];
  document.querySelector(".count").textContent =
    `${String(cur + 1).padStart(2, "0")} / ${slides.length}`;
  document.querySelector(".progress").style.width =
    `${((cur + 1) / slides.length) * 100}%`;
  document.documentElement.style.setProperty(
    "--stage",
    active.style.getPropertyValue("--stage"),
  );
  history.replaceState(null, "", `#${cur + 1}`);
  document.title = `${cur + 1} / ${slides.length} · AI Movie Maker`;
  revealToolbar();
}
function next() {
  show(cur + 1);
}
function prev() {
  show(cur - 1);
}
async function fullscreen() {
  try {
    if (!document.fullscreenElement)
      await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch {
    toast("전체화면을 사용할 수 없습니다. 브라우저의 F11을 사용하세요.");
  }
}
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext)
      await navigator.clipboard.writeText(text);
    else {
      const e = document.createElement("textarea");
      e.value = text;
      e.style.cssText = "position:fixed;left:-9999px;top:0";
      (document.querySelector("dialog[open]") || document.body).append(e);
      e.select();
      const ok = document.execCommand("copy");
      e.remove();
      if (!ok) throw Error("copy failed");
    }
    toast("전체 프롬프트를 복사했습니다.");
  } catch {
    toast("복사하지 못했습니다. 전체 보기에서 직접 선택해 복사하세요.");
  }
}
function copyPrompt(btn) {
  const data = promptData.get(btn.closest(".prompt-wrap"));
  return copyText(data.original);
}
function highlight(text) {
  const e = document.createElement("span");
  e.textContent = text;
  return e.innerHTML.replace(/\{[^}]+\}/g, (m) => `<mark>${m}</mark>`);
}
const dialog = document.createElement("dialog");
dialog.className = "prompt-dialog";
dialog.innerHTML =
  '<header><strong>전체 프롬프트</strong><div class="dialog-actions"><button type="button" class="dialog-copy">COPY · 전체 복사</button><button type="button" class="dialog-close">닫기 · ESC</button></div></header><pre tabindex="0" aria-label="전체 프롬프트"></pre>';
document.body.append(dialog);
let dialogSource;
dialog.querySelector(".dialog-close").onclick = () => dialog.close();
dialog.querySelector(".dialog-copy").onclick = () =>
  copyText(dialogSource.original);
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
});
function openPrompt(wrap) {
  dialogSource = promptData.get(wrap);
  dialog.querySelector("strong").textContent =
    wrap.closest(".slide").querySelector("h1").textContent + " · 전체 프롬프트";
  const pre = dialog.querySelector("pre");
  pre.innerHTML = highlight(dialogSource.original);
  pre.scrollTop = 0;
  dialog.showModal();
  const scale = Math.min(1, (innerWidth - 80) / 1180, (innerHeight - 60) / 740);
  dialog.style.transform = `scale(${scale})`;
  pre.focus();
}
const mediaDialog = document.createElement("dialog");
mediaDialog.className = "media-dialog";
mediaDialog.setAttribute("aria-label", "영상 크게 보기");
mediaDialog.innerHTML =
  '<header><strong></strong><button type="button">닫기 · ESC</button></header><div class="media-dialog-body"><video controls playsinline preload="metadata"></video><div class="media-dialog-copy"><span class="media-dialog-duration"></span><p>재생 버튼을 눌러 감상하세요.</p><small>플레이어의 전체화면 버튼으로 영상을 더 크게 볼 수 있습니다.</small></div></div>';
document.body.append(mediaDialog);
mediaDialog.querySelector("button").onclick = () => mediaDialog.close();
mediaDialog.addEventListener("close", () => {
  const player = mediaDialog.querySelector("video");
  player.pause();
  player.removeAttribute("src");
  player.load();
});
mediaDialog
  .querySelector("video")
  .addEventListener("loadedmetadata", (event) => {
    const duration = event.target.duration;
    mediaDialog.querySelector(".media-dialog-duration").textContent =
      Number.isFinite(duration) ? `${Math.round(duration)}초 · 9:16` : "9:16";
  });
function openMedia(id, title) {
  const url = mediaConfig[id];
  if (!url) return toast("영상 파일이 아직 연결되지 않았습니다.");
  document.querySelectorAll(".slide video").forEach((player) => player.pause());
  const player = mediaDialog.querySelector("video");
  player.src = url;
  player.poster = mediaPosters[id] || "";
  player.setAttribute("aria-label", title);
  mediaDialog.querySelector("header strong").textContent = title;
  mediaDialog.querySelector(".media-dialog-duration").textContent = "9:16";
  mediaDialog.showModal();
  mediaDialog.style.transform = `scale(${Math.min(1, (innerWidth - 60) / 1220, (innerHeight - 40) / 780)})`;
}
function mediaButton(id, title, className = "video-expand") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.setAttribute("aria-label", `${title} 크게 보기`);
  button.title = `${title} 크게 보기`;
  button.textContent = "↗";
  button.onclick = () => openMedia(id, title);
  return button;
}
function setupPrompt(wrap) {
  const pre = wrap.querySelector("pre");
  const original = pre.textContent;
  const blocks = original.split(/\n\s*\n/).flatMap((block) => {
    const lines = block.split("\n");
    const parts = [];
    for (let i = 0; i < lines.length; i += 7)
      parts.push(lines.slice(i, i + 7).join("\n"));
    return parts;
  });
  const groups = [];
  let group = [];
  let linesUsed = 0;
  for (const block of blocks) {
    const lines = block
      .split("\n")
      .reduce(
        (total, line) => total + Math.max(1, Math.ceil([...line].length / 85)),
        0,
      );
    if (group.length && linesUsed + lines + 1 > 8) {
      groups.push(group.join("\n\n"));
      group = [];
      linesUsed = 0;
    }
    group.push(block);
    linesUsed += lines + (group.length > 1 ? 1 : 0);
  }
  if (group.length) groups.push(group.join("\n\n"));
  const data = { original, groups, index: 0 };
  promptData.set(wrap, data);
  pre.tabIndex = 0;
  pre.setAttribute("aria-label", "현재 구간의 프롬프트");
  const tabs = document.createElement("div");
  tabs.className = "prompt-tabs";
  tabs.setAttribute("role", "tablist");
  tabs.setAttribute("aria-label", "프롬프트 구간");
  groups.forEach((text, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("role", "tab");
    const heading = text.match(/\[([^\]]+)\]/);
    b.textContent = `${String(i + 1).padStart(2, "0")} · ${heading ? heading[1] : "프롬프트"}`;
    b.onclick = () => select(i);
    b.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const nextIndex =
          (i + (e.key === "ArrowRight" ? 1 : -1) + groups.length) %
          groups.length;
        select(nextIndex);
        tabs.querySelectorAll("button")[nextIndex].focus();
      }
    });
    tabs.append(b);
  });
  const count = document.createElement("span");
  count.className = "tab-count";
  tabs.append(count);
  wrap.querySelector(".prompt-head").after(tabs);
  const status = document.createElement("div");
  status.className = "prompt-status";
  wrap.append(status);
  const head = wrap.querySelector(".prompt-head");
  const actions = document.createElement("div");
  actions.className = "prompt-actions";
  const copy = head.querySelector("button");
  copy.type = "button";
  copy.setAttribute("aria-label", "전체 프롬프트 복사");
  actions.append(copy);
  const expand = document.createElement("button");
  expand.type = "button";
  expand.className = "expand-button";
  expand.textContent = "전체 보기";
  expand.onclick = () => openPrompt(wrap);
  actions.prepend(expand);
  head.append(actions);
  function select(i) {
    data.index = i;
    pre.innerHTML = highlight(groups[i]);
    pre.scrollTop = 0;
    tabs
      .querySelectorAll("button")
      .forEach((b, j) => b.setAttribute("aria-selected", String(i === j)));
    count.textContent = `${i + 1} / ${groups.length}`;
    requestAnimationFrame(() => {
      status.textContent = `구간 ${i + 1} / ${groups.length} · ${pre.scrollHeight > pre.clientHeight + 2 ? "아래로 스크롤해 계속 읽으세요 · " : ""}COPY는 전체 원문을 복사합니다.`;
    });
  }
  select(0);
}
function setupSlides() {
  const stages = {
    OPENING: ["#226c55", "#eaf4ef"],
    IDEA: ["#88641b", "#fff5dc"],
    STORY: ["#326795", "#eaf1f8"],
    IMAGE: ["#73609a", "#f1eef8"],
    VIDEO: ["#aa5265", "#faeef1"],
    EDIT: ["#267c79", "#e8f5f3"],
    FESTIVAL: ["#88641b", "#fff5dc"],
    FINISH: ["#226c55", "#eaf4ef"],
    "AI MOVIE MAKER": ["#226c55", "#eaf4ef"],
  };
  for (const s of slides) {
    const stage = s.querySelector(".section-pill").textContent;
    const [color, soft] = stages[stage] || stages.OPENING;
    s.style.setProperty("--stage", color);
    s.style.setProperty("--stage-soft", soft);
    s.setAttribute(
      "aria-label",
      `${s.dataset.index} / 36 · ${s.querySelector("h1").textContent}`,
    );
    s.querySelectorAll(".roadmap").forEach((row) =>
      row
        .querySelectorAll("div")
        .forEach((e, i) => (e.dataset.step = String(i + 1).padStart(2, "0"))),
    );
  }
  const s = (n) => slides[n - 1];
  s(19).querySelector(".split").classList.add("two-panel");
  s(27).querySelector(".split").classList.add("two-panel");
  const film = s(1).querySelector(".film-strip");
  film.replaceChildren();
  for (let i = 1; i <= 3; i++) insertSlot(film, `cover-0${i}`, `SCENE 0${i}`);
  const video = s(3).querySelector(".video-placeholder");
  const title = video.querySelector("strong");
  const label = video.querySelector("small");
  video.replaceChildren();
  insertSlot(video, "opening-video", "완성본 영상", "9:16", "video");
  const videoCopy = document.createElement("div");
  videoCopy.className = "video-copy";
  videoCopy.append(title, label);
  const note = document.createElement("span");
  note.className = "media-note";
  if (mediaConfig["opening-video"]) {
    label.textContent = "EDITED MOVIE · MADE WITH AI";
    note.textContent = "편집까지 마친 완성본 · 약 38초";
  } else note.textContent = "예시 영상이 들어갈 자리입니다.";
  videoCopy.append(note);
  video.append(videoCopy);
  const portrait = s(20).querySelector(".portrait-placeholder");
  portrait.firstElementChild.replaceWith(
    slot("character-reference", "기준 캐릭터"),
  );
  for (const n of [11, 16, 25]) {
    const cards =
      n === 11
        ? [...s(n).querySelectorAll(".threebeats>div")]
        : [...s(n).querySelectorAll(".scene")];
    cards.forEach((card, i) => {
      const target = n === 11 ? card.firstChild : card.querySelector("span");
      const e = slot(
        n === 25 ? `scene-0${i + 1}` : `story-0${i + 1}`,
        `SCENE 0${i + 1}`,
      );
      if (n === 11) {
        if (target.nodeType === 3) target.replaceWith(e);
        else card.prepend(e);
        s(n).querySelector(".threebeats").classList.add("has-slots");
      } else {
        target.replaceWith(e);
        card.classList.add("with-media");
      }
    });
  }
  s(24)
    .querySelector(".actor")
    .firstChild.replaceWith(slot("character-reference", "REFERENCE"));
  s(24).querySelector(".lines").innerHTML = "<i></i><i></i><i></i>";
  [...s(24).querySelectorAll(".three>div")].forEach((card, i) =>
    card.firstChild.replaceWith(slot(`scene-0${i + 1}`, `SCENE 0${i + 1}`)),
  );
  s(26)
    .querySelector(".wrong .whale")
    .replaceChildren(slot("reveal-full", "고래 전체 공개", "장면 비교"));
  s(26)
    .querySelector(".right .whale")
    .replaceChildren(slot("reveal-secret", "부분 노출 장면", "장면 비교"));
  const school = s(9).querySelector(".school");
  const link = document.createElement("div");
  link.className = "branch-link";
  link.setAttribute("aria-hidden", "true");
  link.innerHTML = "<i></i><i></i>";
  school.after(link);
  const ruleGroup = document.createElement("div");
  ruleGroup.className = "rules-group";
  s(28).querySelector(".content").append(ruleGroup);
  s(28)
    .querySelectorAll(".rule")
    .forEach((e) => ruleGroup.append(e));
  s(28)
    .querySelectorAll(".threebeats>div")
    .forEach((card, i) => {
      const diagram = document.createElement("div");
      diagram.className = `motion-diagram ${["action", "wave", "camera"][i]}`;
      diagram.innerHTML = icon(["person", "wave", "camera"][i]);
      card.firstChild.replaceWith(diagram);
    });
  const refRoad = s(23).querySelector(".roadmap");
  const instruction = document.createElement("div");
  instruction.className = "instruction-layout";
  refRoad.before(instruction);
  instruction.append(
    refRoad,
    slot("kling-reference-ui", "Kling · 기준 이미지 화면", "화면 캡처", "ui"),
  );
  s(31)
    .querySelectorAll(".scene")
    .forEach((card, i) => {
      const visual = document.createElement("div");
      visual.className = "camera-visual";
      if (mediaConfig[`video-0${i + 1}`]) {
        visual.classList.add("with-video");
        visual.append(
          slot(`video-0${i + 1}`, `SCENE 0${i + 1} · 10초`, "9:16", "video"),
        );
      } else
        visual.innerHTML = `<div class="camera-frame">${icon("person")}</div><span class="camera-arrow">${["→ ←", "—", "← →"][i]}</span>`;
      card.prepend(visual);
    });
  const videoInstruction = document.createElement("div");
  videoInstruction.className = "video-instruction-layout";
  const videoLeft = document.createElement("div");
  videoLeft.append(
    s(31).querySelector(".scene-grid"),
    s(31).querySelector(".transform"),
  );
  videoInstruction.append(videoLeft);
  if (
    mediaConfig["video-01"] &&
    mediaConfig["video-02"] &&
    mediaConfig["video-03"]
  ) {
    videoInstruction.classList.add("has-scene-videos");
  } else
    videoInstruction.append(
      slot("kling-video-ui", "Kling · 영상 생성 화면", "화면 캡처", "ui"),
    );
  s(31).querySelector(".content").append(videoInstruction);
  const timeline = s(32).querySelector(".timeline");
  timeline.querySelectorAll(":scope>div").forEach((card, i) => {
    card.firstChild.replaceWith(slot(`scene-0${i + 1}`, `VIDEO 0${i + 1}`));
    if (mediaConfig[`video-0${i + 1}`])
      card.append(
        mediaButton(
          `video-0${i + 1}`,
          `SCENE 0${i + 1} · 생성 영상`,
          "clip-preview",
        ),
      );
  });
  const edit = document.createElement("div");
  edit.className = "edit-timeline";
  edit.dataset.mediaId = "canva-timeline-ui";
  edit.innerHTML =
    '<div class="timeline-ruler"><span>00:00</span><span>00:10</span><span>00:20</span><span>00:30</span></div><div class="clip-track"><div>VIDEO 01</div><div>VIDEO 02</div><div>VIDEO 03</div></div>';
  edit.setAttribute("aria-label", "세 영상 연결 위치를 보여주는 타임라인 도식");
  timeline.after(edit);
  const caption = s(33).querySelector(".caption-demo");
  const parts = caption.textContent.split(" · ");
  caption.replaceChildren(slot("caption-preview", "자막 예시"));
  const copy = document.createElement("div");
  copy.className = "caption-copy";
  parts.forEach((text, i) => {
    const e = document.createElement(i === 0 ? "strong" : "span");
    e.textContent = text;
    copy.append(e);
  });
  caption.append(copy);
  s(34)
    .querySelectorAll("label")
    .forEach((label) => {
      const text = label.textContent.replace(/^☐\s*/, "");
      label.replaceChildren();
      const input = document.createElement("input");
      input.type = "checkbox";
      const content = document.createElement("span");
      content.textContent = text;
      label.append(input, content);
    });
  const festival = s(35).querySelector(".festival");
  festival.querySelector(".spot").remove();
  const festivalCopy = document.createElement("div");
  while (festival.firstChild) festivalCopy.append(festival.firstChild);
  festival.append(
    mediaConfig["festival-video"]
      ? slot("festival-video", "편집 완성본", "9:16", "video")
      : slot("festival-poster", "작품 포스터"),
    festivalCopy,
  );
  s(36)
    .querySelectorAll(".ending-flow em")
    .forEach((e) => (e.textContent = "→"));
  const mapping = {
    "💭": "idea",
    "📝": "pen",
    "🖼️": "image",
    "🎥": "camera",
    "✂️": "edit",
    "🎬": "film",
    "👤": "person",
    "🤖": "robot",
    "🎮": "game",
    "🏫": "school",
    "🌀": "spark",
    "🎤": "sound",
    "🚀": "chart",
    "🔥": "bolt",
    "😂": "smile",
    "😱": "mystery",
    "⚡": "bolt",
    "🔍": "search",
    "💗": "heart",
    "🧙": "spark",
    "🗺️": "map",
    "💕": "heart",
    "🤯": "spark",
    "📈": "chart",
    "🎯": "target",
    "🏃": "escape",
    "🌱": "sprout",
    "🔁": "loop",
    "💡": "idea",
    "✦": "spark",
    "🛠️": "edit",
    "👀": "search",
    "✏️": "pen",
    "✅": "check",
    "📋": "copy",
    "✨": "spark",
    "⬆️": "upload",
    "↔️": "edit",
    "▶️": "play",
    "👦": "person",
    "🌊": "wave",
  };
  slides.forEach((slide) => {
    const walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode())
      if (!walker.currentNode.parentElement.closest("pre,.media-slot"))
        nodes.push(walker.currentNode);
    for (const node of nodes) {
      let value = node.textContent;
      let changed = false;
      for (const [symbol, name] of Object.entries(mapping)) {
        if (value.includes(symbol)) {
          value = value.split(symbol).join(icon(name));
          changed = true;
        }
      }
      if (changed) {
        const frag = document.createElement("span");
        frag.innerHTML = value;
        node.replaceWith(...frag.childNodes);
      }
    }
  });

  for (const n of [6, 8, 10])
    s(n)
      .querySelectorAll(n === 6 ? ".card" : n === 8 ? ".genre" : ".flow")
      .forEach((card) => {
        card.classList.add("selectable");
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute("aria-pressed", "false");
        const choose = () => {
          card.parentElement.querySelectorAll(".selected").forEach((e) => {
            e.classList.remove("selected");
            e.setAttribute("aria-pressed", "false");
          });
          card.classList.add("selected");
          card.setAttribute("aria-pressed", "true");
        };
        card.onclick = choose;
        card.addEventListener("keydown", (e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            choose();
          }
        });
      });
  document.querySelectorAll(".prompt-wrap").forEach(setupPrompt);
  for (const e of document.querySelectorAll("[data-media-id]")) {
    const id = e.dataset.mediaId;
    let url = mediaConfig[id];
    if (!url && id.startsWith("cover-"))
      url = mediaConfig[id.replace("cover", "scene")];
    if (!url && id.startsWith("story-"))
      url = mediaConfig[id.replace("story", "scene")];
    if (!url && id === "extra-scene-poster") url = mediaPosters["video-04"];
    if (!url) continue;
    const media = document.createElement(
      e.dataset.mediaType === "video" ? "video" : "img",
    );
    media.src = url;
    if (media.tagName === "VIDEO") {
      media.controls = true;
      media.preload = "metadata";
      media.playsInline = true;
      media.tabIndex = 0;
      media.poster = mediaPosters[id] || "";
      media.setAttribute("aria-label", e.getAttribute("aria-label") || id);
    } else media.alt = e.getAttribute("aria-label") || id;
    const fallback = [...e.childNodes];
    const originalRole = e.getAttribute("role");
    const originalLabel = e.getAttribute("aria-label");
    media.addEventListener("error", () => {
      e.replaceChildren(...fallback);
      if (originalRole) e.setAttribute("role", originalRole);
      if (originalLabel) e.setAttribute("aria-label", originalLabel);
      e.classList.remove("has-media");
      toast("미디어 파일을 확인해주세요: " + id);
    });
    e.replaceChildren(media);
    if (media.tagName === "VIDEO") {
      e.append(
        mediaButton(
          id,
          id.startsWith("video-")
            ? `SCENE ${id.slice(-2)} · 생성 영상`
            : "움직이는 섬 · 편집 완성본",
        ),
      );
      media.addEventListener("play", () =>
        document.querySelectorAll("video").forEach((other) => {
          if (other !== media) other.pause();
        }),
      );
    }
    e.classList.add("has-media");
    e.removeAttribute("role");
    e.removeAttribute("aria-label");
  }
}
setupSlides();
document.querySelector(".toolbar").setAttribute("aria-label", "발표 제어");
document
  .querySelector(".toolbar")
  .querySelectorAll("button")
  .forEach((e, i) => {
    e.type = "button";
    e.setAttribute(
      "aria-label",
      ["이전 슬라이드", "다음 슬라이드", "전체화면 전환"][i],
    );
  });
document.querySelector(".toast").setAttribute("role", "status");
window.addEventListener("resize", fit);
window.addEventListener("mousemove", revealToolbar);
window.addEventListener("hashchange", () => {
  const n = parseInt(location.hash.slice(1), 10);
  if (Number.isFinite(n)) show(n - 1);
});
window.addEventListener("keydown", (e) => {
  if (dialog.open || mediaDialog.open) return;
  const target = e.target;
  const interactive = target.closest(
    'button,input,textarea,select,a,video,[role="button"],[role="tab"]',
  );
  const reading = target.closest("pre");
  if (interactive || reading) return;
  if (["ArrowRight", "PageDown", " "].includes(e.key)) {
    e.preventDefault();
    next();
  } else if (["ArrowLeft", "PageUp"].includes(e.key)) {
    e.preventDefault();
    prev();
  } else if (e.key === "Home") {
    e.preventDefault();
    show(0);
  } else if (e.key === "End") {
    e.preventDefault();
    show(slides.length - 1);
  } else if (e.key.toLowerCase() === "f") fullscreen();
});
window.addEventListener("beforeprint", () =>
  document.querySelectorAll(".prompt-wrap").forEach((wrap) => {
    wrap.querySelector("pre").textContent = promptData.get(wrap).original;
  }),
);
window.addEventListener("afterprint", () =>
  document.querySelectorAll(".prompt-wrap").forEach((wrap) => {
    wrap
      .querySelectorAll(".prompt-tabs button")
      [promptData.get(wrap).index].click();
  }),
);
const start = parseInt(location.hash.slice(1), 10);
show(Number.isFinite(start) ? start - 1 : 0);
fit();
