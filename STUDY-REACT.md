# react project 만들기

## 기본 프로젝트 구성하기 

### github 저장소 생성
- 비어 있는 프로젝트 생성하기
- https://github.com/new 에서, 아무 파일도 없는 비어 있는 저장소 생성. 
~~~
- repository name만 입력하고, README .gitignore, license파일 모두 추가 하지 않음.
- create-react-app으로 새 project생성하려면, 비어 있는 저장소 상태여야 함.
~~~



### React Project 생성
- IntelliJ에서 github 저장소 checkout하여 project 생성함.
- IntelliJ에서 terminal을 열어서, cra로 react project를 생성함. 
- 다음 사항을 주의할 것
  - github repo를 checkout한 dir에서 진행 
  - react app 생성 dir을 현재 dir로 선택.( .을 cra dir파라미터로 설정)
  - typescript template을 사용하여 생성할 것.
  - 예시
~~~
  kanon95@sylee-macbook study-react-basic % npx create-react-app . --template typescript

~~~

## 기본 React App 만들기

### React Project dir 구성

```bash
src/
  ├── features/                  # 기능 단위 (ex. login, workspace)
  │   ├── login/
  │   │   ├── container/         # 비즈니스 로직, 상태 관리
  │   │   │   └── LoginContainer.tsx
  │   │   └── view/              # UI 표현 (프레젠테이션 컴포넌트)
  │   │       └── LoginView.tsx
  │   └── workspace/
  │       ├── container/
  │       └── view/
  ├── components/                # 공용 컴포넌트 (Header, Sidebar 등)
  ├── routes/                    # AppRouter.js
  ├── services/                  # API 호출 로직
  ├── hooks/                     # Custom hooks
  ├── utils/                     # 날짜, 숫자, 포맷
  ├── assets/                    # 이미지, CSS
  └── config/                    # 환경 변수, 상수
  
```


### MUI library 설치
```
npm install @mui/material @emotion/react @emotion/styled
```

### React App  만들기
- LoginView.tsx : 로그인 UI 작성. MUI를 사용하여, 간단히 작성
- LoginContainer.tsx : bizLogic추가 - LoginView를 import하고, id/pwd입력 및 로그인 버튼 handler 연결.
- App.tsx : LoginContainer를 import 하기

### React App 실행
```
kanon95@sylee-macbook study-react-basic % npm start

```










  