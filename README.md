# AI Movie Maker 강의자료

GitHub Pages용 완성본은 **`docs/`** 폴더입니다. 강의자료 36장, 실제 프롬프트, 이미지·영상·폰트가 모두 포함되어 있으며 별도 서버나 빌드 없이 작동합니다.

## 일주일 공개 설정

1. 이 프로젝트를 GitHub 저장소에 업로드합니다. `docs/`는 반드시 포함합니다.
2. 저장소 **Settings → Pages → Build and deployment**에서 **Deploy from a branch**를 선택합니다.
3. 공개할 브랜치(예: `main`)와 **`/docs`**를 선택하고 Save를 누릅니다.
4. 표시되는 사이트 주소를 열면 `docs/index.html`의 강의자료가 바로 표시됩니다.

공개 기간 종료 시 **Settings → Pages → Build and deployment → 브랜치 `None` → Save**로 게시를 중단합니다. 이렇게 하면 이후 코드 갱신으로 다시 게시되는 것도 방지할 수 있습니다. 자동 종료는 설정하지 않았습니다. [GitHub 공식 게시 중단 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/deleting-a-github-pages-site).

## 원본과 배포본

- 루트의 기존 강의 HTML과 `assets`는 편집 원본입니다. 루트 `index.html`은 `docs/index.html`로 이동합니다.
- 배포본은 원본 이미지 4장을 고품질 WebP로 변환하고, 사용 중인 영상 4개를 H.264 CRF 23 / AAC 128kbps로 압축했습니다. 영상 해상도와 프레임률을 유지하고 빠른 재생 시작을 위해 `faststart`를 적용했습니다. 클링 화면은 PNG 원본을 사용합니다.
- 사용하지 않는 씬 4, 원본 프롬프트 문서, 검증 캡처, 백업, 작업 도구는 배포본에 포함하지 않습니다. 화면에서 실제 프롬프트 보기·복사 기능은 유지됩니다.
- `.gitignore`는 원본 이미지·영상과 검증·백업 자료를 Git 업로드에서 제외합니다. 로컬 원본 파일은 유지됩니다. 압축된 배포용 미디어는 `docs/assets`에 포함됩니다.

## 수정 후 배포본 갱신

로컬 원본 이미지·영상과 Node.js, Python(Pillow), FFmpeg가 설치된 작업 환경에서 실행합니다.

```powershell
node tools/build-actual-prompts.cjs
python tools/build-pages.py
```

실제 영상 프롬프트 수정본은 `assets/prompt/video-prompt-overrides.json`에서 관리합니다. 갱신된 `docs/`를 GitHub에 반영하면 사이트도 갱신됩니다. `docs/` 배포본 자체는 위 도구 없이 사용할 수 있습니다.
