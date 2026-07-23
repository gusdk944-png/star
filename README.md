# 이 폴더로 뭘 만드는 건가요?

여러분의 "커리어 운명 프로파일" 사이트를 실제 인터넷 주소로 열리게 만드는 거예요.
아래 순서대로만 따라 하면 돼요. 프로그래밍 지식이나 별도 프로그램 설치는 필요
없어요 — 전부 웹사이트 화면에서 클릭만으로 진행돼요.

**전체 그림**: 파일들을 깃허브(GitHub, 파일 보관 창고)에 올리고 → Vercel(무료
호스팅 서비스)이 그 창고를 읽어서 자동으로 사이트를 열어줘요. Claude API 키(비밀
번호)는 Vercel 안에만 안전하게 보관돼요.

---

## 1단계. 깃허브(GitHub) 계정 만들기

1. https://github.com 접속
2. 오른쪽 위 **Sign up** 클릭
3. 이메일, 비밀번호, 사용자 이름 입력하고 안내에 따라 가입 완료

## 2단계. 저장소(Repository) 만들고 파일 올리기

1. 로그인 후 오른쪽 위 **+** 버튼 → **New repository** 클릭
2. Repository name에 원하는 이름 입력 (예: `career-destiny-profile`)
3. **Public**으로 두고 **Create repository** 클릭
4. 만들어진 빈 저장소 화면에서 **uploading an existing file** 링크 클릭
   (또는 상단의 **Add file → Upload files**)
5. 이 폴더 안의 파일들을 전부 끌어다 놓으세요:
   - `index.html`
   - `api` 폴더 (그 안의 `claude.js` 포함)
   - `README.md` (안 올려도 상관없어요)

   ⚠️ `.env.example`은 올리지 않아도 돼요 — 실제 키는 이 파일이 아니라
   나중에 Vercel 화면에서 직접 입력할 거예요.
6. 아래 **Commit changes** 버튼 클릭

## 3단계. Vercel 계정 만들고 이 저장소 연결하기

1. https://vercel.com 접속 → **Sign Up** 클릭
2. **Continue with GitHub** 선택 (방금 만든 깃허브 계정으로 바로 가입돼요)
3. 가입 후 **Add New... → Project** 클릭
4. 방금 올린 저장소(`career-destiny-profile`)를 찾아서 **Import** 클릭
5. 다른 설정은 그대로 두고 **Deploy** 버튼 클릭 (1~2분 정도 걸려요)

## 4단계. Claude API 키 발급받기

1. https://console.anthropic.com 접속해서 계정을 만드세요 (깃허브·Vercel과는
   별개의 계정이에요)
2. 결제 수단(카드)을 등록해야 API를 쓸 수 있어요 — 사용한 만큼만 요금이 나가요
3. 왼쪽 메뉴에서 **API Keys** → **Create Key** 클릭
4. 만들어진 키(`sk-ant-...`로 시작)를 복사해두세요. **이 키는 딱 한 번만
   보여줘요**, 꼭 안전한 곳에 잠깐 메모해두세요.

## 5단계. Vercel에 API 키 등록하기

1. Vercel에서 방금 배포한 프로젝트로 들어가세요
2. **Settings → Environment Variables** 클릭
3. Key(이름)에 `ANTHROPIC_API_KEY`, Value(값)에 4단계에서 복사한 키를 붙여넣고
   **Save**
4. 화면 위쪽 **Deployments** 탭 → 가장 최근 배포 옆 **⋯** 버튼 → **Redeploy**
   클릭 (환경변수는 다시 배포해야 적용돼요)

## 6단계. 사이트 열어보기

1. Vercel 프로젝트 화면 맨 위에 있는 도메인 주소
   (`https://프로젝트이름.vercel.app` 같은 형태)를 클릭
2. 실제로 열린 사이트에서 생일 등을 입력하고 **전체 진로분석 리포트 생성**
   버튼을 눌러 잘 작동하는지 확인하세요

---

# 폴더 구성 설명

- `index.html` — 사이트 화면 전체. **빌드(조립) 과정이 필요 없어요** — 브라우저가
  열 때 그 자리에서 바로 실행돼요. 실제로 배포되는 메인 파일이에요.
- `api/claude.js` — 서버 역할. Claude API 키는 여기서만 사용되고, 손님
  브라우저에는 절대 노출되지 않아요.
- `.env.example` — 로컬 컴퓨터에서 직접 테스트해볼 때만 필요한 참고용 파일이에요.
  실제 배포에는 안 써도 돼요.
- `career-destiny-profile.production.jsx` — `index.html` 안에 이미 포함된 것과
  같은 코드의 원본이에요. 나중에 코드를 수정할 때 참고용으로 남겨뒀어요.

# 문제가 생기면

- 사이트는 열리는데 리포트 생성이 안 된다 → 4~5단계(API 키 등록)를 다시 확인해보세요.
- 화면 자체가 하얗게 빈 채로 안 뜬다 → 브라우저에서 F12를 눌러 Console 탭에 빨간
  오류가 있는지 확인해서 그 내용을 알려주세요.
- 그 외 오류 메시지가 뜨면, 화면에 뜬 메시지 전체를 그대로 알려주시면 원인을
  같이 찾아드릴게요.
