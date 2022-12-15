# **프로젝트 소개**

**사용자가 작성한 카드들을 한 눈에 시각적으로 볼 수 있는 대시보드입니다.**

사용자는 카드를 생성하여 메모, 사진, 해야할 일들을 입력할 수 있습니다.
생성된 카드는 수정하고 삭제할 수 있으며 카드들은 원하는 곳에 배치할 수 있습니다.

배포링크: https://www.slh-dashboard.online
<br />
Client repository : https://github.com/Team-Deep-Diver/dashboard-client

<img width="1430" alt="스크린샷 2022-11-02 오후 5 15 02" src="https://user-images.githubusercontent.com/82071500/199466703-eefb6a6b-4565-4534-aa67-b6fafb8c3945.png">

<br />

# 📆 **개발 기간**

**기간 : 2022.10.10 ~ 2022.10.28 (총 19일)**

- Week1
  - 아이디어 수집 및 확정
  - 기술스택 검증
  - DB 모델링, 스키마 검토
  - API 문서 작성
  - User Flow 시나리오 작성
  - Figma를 사용한 Mockup 제작
  - 칸반 티켓 생성
- Week 2 ~ Week 3
  - 개발
  - 테스트 코드 작성
  - 버그 수정
- Week 4
  - 유지 보수 및 리팩토링

<br />

# 🛠 **기술 스택**

### **_Frontend_**

- React
- React-router-dom
- react-redux
- styled-components
- framer-motion

### **_Backend_**

- Node.js
- Express
- MongoDB
- Mongoose

### **_Etc_**

- socket.io

<br />

# 💻 **실행 방법**

### **_Front_**

클라이언트 레포지토리를 클론받습니다.

```
git clone https://github.com/Team-Deep-Diver/dashboard-client.git
```

프로젝트 폴더 root 위치에 .env 파일을 만들고 다음과 같이 환경변수를 설정합니다.

```
REACT_APP_SERVER_REQUEST_HOST
REACT_APP_SOCKET_SERVER_HOST
```

client 프로젝트 폴더 터미널에서 아래 명령어를 실행합니다.

```
npm install
npm start
```

### **_Back_**

서버 레포지토리를 클론받습니다.

```
git clone https://github.com/Team-Deep-Diver/dashboard-server.git
```

프로젝트 폴더 root 위치에 .env 파일을 만들고 다음과 같이 환경변수를 설정합니다.

```
PORT
SOCKET_CLIENT_HOST
MONGOOSE_URL
JWT_SECRET
SESSION_SECRET
```

server 프로젝트 폴더 터미널에서 아래 명령어를 실행합니다.

```
npm install
npm run dev
```

<br />

# 🔥 **도전 과제**

### 1. 효율적인 DB 관리

카드의 히스토리를 관리하기 위한 Snapshot 데이터를 생성하며, Snapshot을 어떻게 생성하고 관리할 것인가에 대한 문제에 직면하게 되었습니다. 처음 설계했던 방식은 카드가 생성될 때 해당 카드에 설정된 기간만큼 Snapshot 데이터를 생성하는 것이었습니다. 이는 로직상으로는 간단하지만 불필요한 데이터가 생성될 수 있다는 단점이 있어, 사용자가 웹을 방문한 날짜를 기준으로 Snapshot을 생성하는 방식을 고안하게 되었습니다.

예를 들어, 사용자가 한 달(30일)이라는 기간이 설정된 카드를 생성한 후, 28일이 지난 시점에 다시 웹을 방문했다고 가정한다면, 위 두 로직은 아래와 같은 차이가 나타납니다.

|                       | Snapshot 모두 생성 ( 기존 로직 )                                               | Snapshot 별도 생성 ( 수정 로직 )                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 생성된 Snapshot 개수  | 30개                                                                           | 2개                                                                                                                                                             |
| Snapshot 생성 시점    | Card 데이터 생성 당시, 카드에 설정된 기간(30일) 만큼 Snapshot 데이터 모두 생성 | Card 데이터가 생성될 때에는 해당 날짜의 Snapshot만 생성. 이후 사용자의 재방문시 가장 최근의 Snapshot 데이터(1일자)를 바탕으로 해당 날짜(28일자)의 Snapshot 생성 |
| 카드의 수정 사항 반영 | 28일자 Snapshot에 수정 반영. (1~27일자 Snapshot은 중복된 내용의 데이터를 가짐) | 28일자 Snapshot에 수정 반영. (달력 내 날짜 이동시, 2~27일자 데이터는 모두 1일자 Snapshot을 바탕으로 제공됨)                                                     |

위 과정은 관계형 데이터 모델링을 다뤄보는 기회가 되었습니다. mongoose query의 다양한 메서드를 적용해보며, 최소한의 데이터로 효율적인 DB 관리를 이루는 것 뿐만 아니라 꼼꼼하게 DB 간의 관계를 다루는 자세 역시 중요하다는 점을 배울 수 있었습니다.

<br />

### 2. DND 구현 ( Drag and Drop )

Grid를 활용한 DND를 구현했습니다. 카드의 자유로운 이동을 구현할 수도 있었지만, 레이아웃에 질서를 제공하는 것이 시각적으로도 컨텐츠를 더 잘 파악하는데 도움이 될 것이라 판단하여 grid를 활용하게 되었습니다.

DND를 구현하며 저희가 집중했던 핵심 3가지는 다음과 같습니다.

1. drag and drop 이벤트 : onDragStart와 onDrag, 그리고 onDragEnd 이벤트를 기준으로 카드의 움직임을 캐치했으며, 최종 좌표를 DB에 업데이트함으로써 페이지를 refresh 하여도 카드의 위치가 유지될 수 있도록 했습니다.
2. grid에 맞게 좌표값 재설정 : grid 한 칸 사이즈인 70px을 기준으로, dashboard 내 좌표값을 설정하였습니다. 예를 들어, 왼쪽 상단 모서리로부터 가로 210px, 세로 140px 거리에 위치한 카드는 (3, 2)의 좌표값을 갖게 됩니다. 이를 바탕으로, 사용자의 DND 이벤트가 멈춘 지점으로부터 가장 가까운 좌표값을 찾아 카드의 위치값을 재설정한 후 모션에 반영했습니다.
3. 카드의 부드러운 움직임 : Framer motion의 drag 제스처를 이용했습니다. 모달 및 사이드바 모션에 적용한 것과 동일한 라이브러리를 사용함으로써 사용자 인터렉션에 통일감을 주고자 했습니다.

다만 현재 로직은 화면에 보이는 개수만큼 grid를 모두 생성해야 한다는 점에서 한계를 갖습니다. 무한 스크롤과 같은 기능을 추가한다고 가정하였을 때, 스크롤하는 만큼 grid를 무한히 생성하고 또 방대한 양의 데이터셋을 모두 그리는 것은 성능에 부정적인 영향을 미칠 수 있습니다. 따라서 렌더링 최적화 작업이 향후 이루어져야 하며, 이는 Virtuoso와 같은 라이브러리를 통해 렌더링 제한 조건을 부여함으로써 개선할 수 있을 것이라 생각합니다.

<br />

### 3. 권한 설계 및 구현

본 프로젝트에서 `GUEST`, `MEMBER`, `ADMIN` 3개의 권한으로 나누어 CRUD를 진행했습니다.

기획 초기 단계에서는 `MEMBER` 권한만 존재했습니다.

`MEMBER` 권한은 사용자가 회원 가입 후에 부여되는 권한입니다. 따라서 사용자는 회원 가입을 하지 않는다면 서비스를 이용할 수 없었습니다. 이런 허들을 낮추고자 회원가입 & 로그인 하지 않고도 서비스를 이용할 수 있는 `GUEST` 권한을 추가하였습니다.

또한, 유저들이 모인 그룹이 있고 그룹을 관리할 수 있는 기능을 추가하고 싶다는 팀 내 논의가 있었습니다. 여러 대시보드 서비스에서 관리자 권한으로 멤버를 승인하고 탈퇴시키는 등의 기능을 제공하기 때문에 저희도 실제 서비스와의 유사성을 고려하여 `ADMIN` 권한을 추가하였습니다.

권한이 늘어남에 따라 각 권한에 따라 접근할 수 있는 화면을 상이하게 설정할 필요를 느꼈고 그에 따라 기능들도 세분화하여 작업했습니다. 아래는 각 권한의 역할과 기능입니다.

| 권한   | 역할                                             | 기능                                                                                             |
| ------ | ------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| GUEST  | 로그인하지 않아도 서비스에 접근 가능한 손님 권한 | 카드 생성, 카드 수정 및 삭제, 페이지 이탈 시 생성한 카드 정보 삭제, 회원가입 페이지로 이동       |
| MEMBER | 원하는 그룹에 신청할 수 있는 개인                | 그룹 검색, 그룹 참가 신청, 카드 생성, 카드 수정 및 삭제, 내 그룹 현황 보기, 그룹 탈퇴, 공지 읽기 |
| ADMIN  | 그룹의 관리자, 개인 유저로도 활동 가능           | 공지 생성 및 읽기, 그룹에 신청한 참가자 수락 및 거절, 카드 생성, 카드 수정 및 삭제               |

그룹과 `ADMIN` 권한이 생기면서 User 모델과 Group 모델 간 양방향 관리가 필요했습니다. 아래는 각 모델의 설명입니다.

User 모델: 유저의 정보를 가지고 있습니다. 권한에 따라 userType에는 `MEMBER` 또는 `ADMIN` 이 저장됩니다. 유저 권한이 `MEMBER` 일 경우, 그룹 지원 현황에 따라 PARTICIPATING / PENDING / REJECTED의 상태가 저장됩니다.

Group 모델: 그룹의 정보를 가지고 있습니다. userType이 `ADMIN` \*\*\*\*인 \_id 값이 Group 모델의 admin 속성에 저장되며, 그룹 지원 현황에 따라 members/applicants 필드에 값이 추가됩니다.

**User, Group 모델 스키마 관계도**

![user-group-schema](https://user-images.githubusercontent.com/82071500/206397762-a5fbb2e8-aaa9-4ce1-8f66-e1e133721b16.png)

여러개의 권한을 정의하고 실제 구현을 하면서 각 권한의 역할과 권한의 관계(MEMBER - ADMIN)에 따라 어떻게 기능들을 정의해야할 지에 대해 깊게 생각해볼 수 있었습니다. 또한 동일한 API 요청이라도 권한에 따라 기능을 달리해야하는 경우를 겪으면서 권한 하나 늘어난다는 것은 단순히 기능이 늘어나는 것뿐만 아니라 기능들이 권한에 따라 복잡해질 수 있는 것을 배웠습니다.

<br />

# 📣 **주요 기능**

|||
| :---------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------: |
|![1 메인화면](https://user-images.githubusercontent.com/82071500/206398429-2245f598-14b0-4e8f-b5a4-313bf59db5e3.gif)|![2 회원가입](https://user-images.githubusercontent.com/82071500/206398464-1affeb63-85f8-4069-86fc-ba24337d91dd.gif)|
|   1. 메인 화면: Guest와, User 중 선택하여 대시보드 페이지로 이동할 수 있습니다. 회원가입 페이지로 이동할 수 있습니다.   |                                  2. 회원 가입: 권한 중 member, admin을 선택하여 회원가입을 할 수 있습니다.                                  |
|![3 로그인](https://user-images.githubusercontent.com/82071500/206398590-3411fe24-9067-4c20-9c3a-669cd996ad33.gif)|![4 그룹참가하기](https://user-images.githubusercontent.com/82071500/206398646-8190e653-2f7f-4772-a71f-ab265995e830.gif)|
|                             3. 로그인: 가입한 이메일과 비밀번호로 로그인을 할 수 있습니다.                              |                              4. 그룹 참가하기: 권한이 멤버인 user는 그룹을 검색하고 그룹에 참여할 수 있습니다.                              |
|![5 내그룹현황보기](https://user-images.githubusercontent.com/82071500/206398790-f14fee3d-7247-4b9c-9875-aae063eea42a.gif)|![6 그룹관리](https://user-images.githubusercontent.com/82071500/206398809-360aa2a1-0767-491d-ba71-99730bff1cef.gif)|
|       5. 내 그룹 현황 보기: member 권한을 가진 사용자가 자신이 참여한 그룹, 신청한 그룹 리스트를 볼 수 있습니다.        | 6. 그룹 관리하기: admin 권한을 가진 사용자가 그룹에 신청한 member 리스트를 볼 수 있습니다. 신청한 멤버들을 수락 또는 거절을 할 수 있습니다. |
|![7 공지보내기](https://user-images.githubusercontent.com/82071500/206398892-95c0251b-431d-457a-99c6-bee3f0e6b441.gif)|![8 카드생성](https://user-images.githubusercontent.com/82071500/206398907-fdad37fd-ef4f-45de-8476-c393275c068e.gif)|
| 7. 공지보내기: 소켓을 이용하여 공지를 보낼 수 있습니다. 해당 그룹에 속한 멤버들은 실시간으로 공지를 확인할 수 있습니다. |                                     8. 카드 생성하기: 플러스 버튼을 이용하여 카드를 생성할 수 있습니다.                                     |
|![9 카드수정삭제](https://user-images.githubusercontent.com/82071500/206398966-50598ffd-b57f-4da2-9d91-b60f4d18a536.gif)|![10 카드이동](https://user-images.githubusercontent.com/82071500/206398979-0f4955fe-c5f8-4203-b2a1-927448c81e6b.gif)|
|             9. 카드 수정 및 삭제: 생성된 카드를 더블 클릭하여 내용을 수정하거나 카드를 삭제할 수 있습니다.              |                                      10. 카드 이동: 카드를 원하는 곳에 드래그로 이동시킬 수 있습니다.                                       |
|![11 날짜이동](https://user-images.githubusercontent.com/82071500/206399082-c7d3ed9d-a4dd-409c-9d31-71592340d482.gif)||
|   11. 날짜 이동: 이전 날짜로 이동이 가능하며 이전 날짜의 카드 상태와 오늘 날짜의 카드 상태를 비교해서 볼 수 있습니다.   |                                                                                                                                             |

<br />

# 🙏 **소감**

### **_사공은혜_**

처음으로 팀원들과 함께 프로젝트를 진행하며, 소통도 개발의 일부분이라는 점을 배웠습니다. 개개인의 실력을 넘어, 서로 간 적극적으로 소통하며 공유하는 것이 프로젝트의 진행 및 완성도에 큰 영향을 미친다는 점을 깨달았습니다.

특히 DND 구현 당시, 소통과 협업의 힘을 몸소 느낄 수 있었습니다. DND는 저희가 생각했던 핵심 인터랙션 기능이자 메인 챌린지 중 하나로, 각자 맡아 개발했던 다른 부분들과는 달리 함께 진행하는 방식을 택했습니다. 어떤 방식으로 dashboard 내 grid를 그리고 카드의 좌푯값을 재설정할 것인지에 대한 고민이 많았는데, 서로가 찾은 자료를 공유하고, 진행 도중 막힌 부분은 함께 그 원인과 솔루션을 찾음으로써 조금씩 해결해 나갈 수 있었습니다. 일방향 소통이 아니라, 핑퐁으로 주고받으며 나아가던 이 순간이 저에게는 전체 프로젝트 중 가장 재밌고 또 기억에 남을 경험이 되었습니다.

공통화된 문서를 체계화하는 것 또한 중요하다는 점을 배울 수 있었습니다. API 명세서를 명확히 작성할수록 프런트와 백엔드 간의 작업이 원활하게 이루어졌고, 이중 작업을 방지하기 위해서는 공통된 문서의 싱크를 잘 맞출 필요도 있었습니다. 기본적이지만 중요한 팀워크의 자세를 배우며, 이번 경험을 토대로 팀원들의 합의와 협업을 이끌어내는 자세로 프로젝트에 임할 수 있도록 노력해 나가겠습니다.

<br />

### **_이세영_**

켄님과 멘토님 드리 항상 강조하시던 한 줄 한 줄의 의미, 왜 쓰이는가에 대해 파고들어야 하는 이유와 중요성을 깨닫게 된 시간이었습니다. 구현한 내용에 대한 PR 진행이나 의견을 내야 할 때 논리적으로 설명하지 못했었습니다. 그 이유가 두루뭉술하게 이해하고 넘어가서 생긴 문제점이라고 생각합니다. 문제점을 깨닫고, 말씀하시던 부분에 대해 생각하며 파고든 결과, 저의 코드에 대해 논리적으로 설명할 수 되었고, 이것이 결과적으로 팀원분들과 조금 더 수월하게 소통하게 되는 바탕이 되었습니다.

또한 초기 기획 단계에서, 또는 개발 중간중간에 당연하다고 생각하고 넘어갔던 부분들이 개발을 진행하면서 당연하지 않았다는 것을 알았습니다. 기획 단계에서 많은 논의를 했지만 그럼에도 부족했던 것 같습니다. 적다면 적은 3명의 팀원뿐임에도 사소한 사안에 대한 생각이 매번 달라 다 같이 놀랐던 적도 있습니다. 다행히 개발 중간에도 끊임없이 소통해 그런 사항들을 바로잡았습니다. 이러한 소통을 하지 않고 개발이 진행되었다면 각자의 작업 분량을 통합하는 시점에 어긋나 있을 많은 접점들을 바로잡는데 많은 시간을 쏟게 됐을 것입니다. 이러한 경험을 통해 의사소통의 중요성과 필요성을 깨달았습니다.

팀 프로젝트를 진행하며 팀원들의 장점을 직접 느끼고, 배우며, 적용해 볼 수 있어서 좋았고, 또 그에 대비된 저의 장점과 단점에 대해서도 고민해 볼 수 있게 된 정말 유익한 시간이었습니다.

<br />

### **_한아름_**

저는 이번 프로젝트를 진행하면서 소통의 중요성, 소통의 힘을 많이 깨달았습니다.

제가 프론트엔드 작업을 하는 도중에 백엔드로 부터 받은 응답 데이터 수정이 필요한 상황이 생겼습니다. 이미 백엔드 작업이 완료된 상태였는데 이 상황을 설명해 드리는 게 처음에는 어려웠습니다. 그럼에도 백엔드 작업을 맡으신 분한테 응답 데이터 수정요청이 필요한 상황을 설명해 드렸습니다. 이러한 과정이 여러 번 있었는데 이러한 일련의 과정을 거치면서 백엔드, 프론트엔드 각각의 처지에서 생각해보고 소통하는 연습을 하게 되어서 매우 좋았습니다.

또한 프로젝트를 진행 도중 문제를 하나하나 맞닥뜨릴 때마다 걱정이 많아지고 감정적으로 불안해졌습니다. 그러나 팀원들과 같이 소통하면서 그런 걱정에서 내려와서 실제로 우리가 해결해야 하는 문제가 정확히 무엇인지 그 문제가 발생하는 원인이 무엇이고 어떤 부분을 해결해야 하는지 객관적으로 현실을 받아들이는 연습이 되었습니다. 문제를 해결하려면 꽁꽁 싸매서 걱정하지 말고 팀원들과 적극 소통해야 함을 배웠습니다.
