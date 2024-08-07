# 🖼️ Noona Culture  
![version](https://img.shields.io/badge/version-1.0.0-blue)  

![NoonaCulture_logo](https://github.com/user-attachments/assets/9a14c607-6ea2-40f6-bad6-bfbb84087c0f)  

<details>
<summary>업데이트 정보 보기</summary>

- v1.0.0 (2024-06-30): 첫 번째 릴리스

</details>

## 목차

- [👨‍🏫 프로젝트 소개](#-프로젝트-소개)
- [🧑‍🤝‍🧑 팀 소개](#-팀-소개)
- [⚙️ 기술 스택](#-기술-스택)
- [📌 주요 기능](#-주요-기능)
- [🎯 트러블 슈팅](#-트러블-슈팅)
- [🖋 회고](#-회고)


## 👨‍🏫 프로젝트 소개  
![noona](https://github.com/user-attachments/assets/c8235309-fe09-42f1-952f-f56e3337c3a8)  
Noona Culture는 공연정보를 조회 및 예매할 수 있는 종합적인 서비스입니다.  

- 배포페이지 바로가기: [Noona Culture](https://noona-culture.netlify.app/)
- User Story 바로가기: [User Story](https://docs.google.com/spreadsheets/d/1HGgDP4rUhWvZL-eKAirGMlfbq1DQ98yUOebkyV5f2GQ/edit?gid=0#gid=0)
- front-end repository 바로가기: [node-team6-fe](https://github.com/hhhyeon97/node-team6-fe)
- 발표 ppt 바로가기: (준비중)
- 프로젝트 노션 바로가기: (준비중)
- 프로젝트 ERD: [ERD](https://app.diagrams.net/#G1Z4yWPmKpvHqm78CCv1bmOwMLuUIFFN_Q#%7B%22pageId%22%3A%22eOnixxZUXJWLaz6sClB1%22%7D)
<img width="600" alt="스크린샷 2024-07-14 오후 4 53 46" src="https://github.com/user-attachments/assets/a1f3835b-c43a-4247-baa8-5008e629757a">

  
### 📅 개발기간 및 진행방식

<img width="702" alt="스크린샷 2024-07-14 오후 3 49 25" src="https://github.com/user-attachments/assets/e346fff5-7b4a-4d8f-913c-c43e2560d6c9">

- 개발기간: 2024-06-16 ~ 2024-06-30
- 진행방식: AGILE, SCRUM

## 🧑‍🤝‍🧑 팀 소개  
코딩알려주는누나 Node.js 스터디 1기 6조
| 팀원 | 역할 | 담당파트 | 깃허브 주소 |
|---|---|---|---|
| 최주연 | Project Owner | 마이페이지, 관리자페이지, 웹디자인 | [jebi2420](https://github.com/jebi2420?tab=overview&from=2024-01-01&to=2024-01-04) |
| 김민솔 | Scrum Master | 회원가입 페이지, 로그인 페이지, 비밀번호 재설정, 공지사항 페이지  | [hhhyeon97](https://github.com/hhhyeon97) |
| 정예진 | Developer | 공연리스트 페이지, 공연디테일 페이지, 예매&결제 페이지 |[newuserYejin](https://github.com/newuserYejin) |
| 송이수 | Developer | 메인 페이지, 검색 페이지, 찜 페이지, 헤더&푸터 | |

## ⚙️ 기술 스택  
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white">
<img src="https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white">
<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">
<img src="https://img.shields.io/badge/fontawesome-528DD7?style=for-the-badge&logo=fontawesome&logoColor=white">
<img src="https://img.shields.io/badge/netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white">
<img src="https://img.shields.io/badge/bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white">
<img src="https://img.shields.io/badge/sass-CC6699?style=for-the-badge&logo=sass&logoColor=white">
- API: [공연예술통합전산망](https://www.kopis.or.kr/por/cs/openapi/openApiInfo.do?menuId=MNU_00074)
- SERVER: Cloude Type
- 아이디어 및 회의 툴 : Figma(Figjam), Discode, Notion, Spread Sheet


## 📌 주요 기능
 - 관람일자로 나의예매내역 조회
   - 달력에서 내가 예매한 공연의 관람일자를 클릭시 해당 예매내역이 리스트로 뜬다
 - 로그인/회원가입
   - 정규식 유효성 검증과 예외처리를 통해 중복 이메일 가입을 방지한다.
   - 로그인한 사용자는 토큰 유지 설정에 따라 로그인을 유지할 수 있다.
   - 구글/카카오 계정을 통해 소셜 로그인을 할 수 있다.
 - 비밀번호 재설정
   - 가입했던 이메일로 비밀번호 재설정 링크를 전송한다.
   - 재설정시 링크에 유효한 토큰을 함께 넣어 설정한 시간내에 비밀번호를 변경할 수 있게 한다.
 - 사용자 공지사항 페이지
   - 사용자는 아코디언 형식의 게시판을 통해 공지 목록을 확인할 수 있다.
   - 중요 공지인 경우 상단으로 필터링하여 배치한다.
 - open Api를 이용한 공연 리스트 출력
   - 오늘 날짜를 기준으로하여 공연중인 리스트를 기본값으로 출력한다.
   - 사용자가 캘린터에서 선택한 날짜에 따른 공연 중 또는 공연 예정의 리스트를 출력한다.
   - 원하는 카테고리별 공연을 출력한다.
   - 지역 필터를 추가하여 지역별로 결과를 받을 수 있다.
 - 공연 디테일 페이지
   - 사용자가 선택한 공연 정보를 출력한다.
   - kakao map api를 이용해 공연장의 위치를 지도로 표시하여 나타낸다.
   - 해당 사이트 내에서 해당 공연에 관련된 리뷰가 있다면 사용자의 닉네임, 점수, 리뷰 내용, 사진을 출력하여 제공한다.
 - 예매 & 결제 페이지
     - 오늘 날짜를 기준으로 과거의 날짜는 예매할 수 없게 한다.
     - 결제 정보와 사용자가의 티켓 수량 정보를 받고 그에따른 할인 적용결과 등 사용자의 예매 예정 내역을 제공한다.
     - 사용자가 경제를 완료하면 사용자의 정보와 결제된 공연의 정보를 DB에 저장한다.
     - 또한 공연 기간을 기준으로 공연 이후의 날짜도 선택이 불가하게 막아둔다.
- 결제 완료 페이지
     - 오늘 날짜를 기준으로 예매번호를 커스텀하여 추후 사용자가 검색 가능하게 한다.


## 🎯 트러블 슈팅
### 트러블
- **비밀번호 재설정 메일 전송**
    - 문제점: 사용자 비밀번호 재설정 요청 시, 보안 토큰을 생성하고 이를 이메일로 전송하는 과정에서 발생하는 오류와 보안 문제
    - 해결 방법:
        - **유효성 검사 및 예외 처리**: 사용자가 입력한 이메일이 존재하는지 확인하고, 존재하지 않는 이메일에 대해서는 예외를 발생시킴
        - **암호화된 토큰 생성**: `crypto` 모듈을 사용하여 보안 토큰을 생성하고, 이 토큰을 데이터베이스에 저장함으로써 유효성을 검증함
        - **토큰 유효 기간 설정**: 토큰의 유효 기간을 1시간으로 설정하여, 시간이 지난 토큰은 사용할 수 없도록 함
        - **이메일 전송**: `nodemailer` 모듈을 사용하여 사용자의 이메일로 비밀번호 재설정 링크를 전송

- **XML데이터 변환**
   - 문제점: open api로 받아오는 데이터의 형태가 xml형태로 json형태로의 변환이 필요.
   - 시도 방법:
      - **xml2js**: npm 에서의 xml2js을 설치하여 해결하려하였으나 buffer 추가 설치, loading 등의 여러가지 설치 이슈의 이유로 방법 변경하기로 결정.
      - **domparser**: xml데이터를 parseFromString 를 이용하여 dom트리구조로 변환. xmlToJson를 작성하여 nodeType에 대한 처리를 작성하고 JSON 객체에서 불필요한 텍스트 노드를 정리하기 위해 cleanUp 작성 하여 활용
- **mongoDB 날짜 저장**
   - 문제점: mongoDB에 날짜 타입을 저장하게 되면 9시간이 더해져서 저장된다.


## 🖋 회고
| 팀원 | 회고 |
|---|---| 
| 최주연 | - |
| 김민솔 | - 팀원분들을 통해 협업하는 방법을 배우는 시간이었고 <br/>카카오 로그인, 메일 전송 등 처음 접한 기능들을 구현하며 재밌었습니다.|
| 정예진 | - 처음으로 fe와 be를 모두 경험해볼 수 있어서 뜻 깊었고,<br/> 처음 적용해보는 기술들, xml변환, db와의 소통,<br/> 외래키를 이용해서 다른 테이블 데이터 호출 등 쉽지 않았던 일들이 있었지만 경험해볼 수 있어서 좋았습니다. |
| 송이수 | - |

<div align="right">
  
[목차로](#목차)

</div>
