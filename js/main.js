// global key

const TYPE_KEY = Object.freeze({
  sticky: 'sticky',
  normal: 'normal',
});

(() => {
  let yOffset = 0; //window.scrollY
  let prevScrollHeight = 0; //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; //현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
  let enterNewScene = false; // 새로운 scene시작 유무

  const sceneInfo = [
    //0
    {
      type: TYPE_KEY.sticky,
      // 브라우저 높이의 5배로 scrollHeight 세팅 (각 기기가 가진 높이를 읽어와서 그 높이 x5를 해줌으로써 여러가지 종류의 디바이스에서 같은 경험을 할 수 있게 해줌)
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-0'),
        messageA: document.querySelector('#scroll-section-0 .main-message.a'),
        messageB: document.querySelector('#scroll-section-0 .main-message.b'),
        messageC: document.querySelector('#scroll-section-0 .main-message.c'),
        messageD: document.querySelector('#scroll-section-0 .main-message.d'),
      },
      values: {
        //messageA
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
        //messageB
        messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
        messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
        messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
        messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
        //messageC
        messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
        messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
        messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
        messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
        //messageD
        messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
        messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
        messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
      },
    },
    //1
    {
      type: TYPE_KEY.normal,
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-1'),
      },
    },
    //2
    {
      type: TYPE_KEY.sticky,
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-2'),
      },
    },
    //3
    {
      type: TYPE_KEY.sticky,
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3'),
      },
    },
  ];

  //section height
  function setLayout() {
    //각 스크롤 섹션 높이 셋팅
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === TYPE_KEY.sticky) {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i] === TYPE_KEY.normal) {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.getBoundingClientRect().height;
      }
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    let totalScrollheight = 0;
    yOffset = window.scrollY;

    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollheight += sceneInfo[i].scrollHeight;
      if (totalScrollheight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.querySelector('body').setAttribute('id', `show-scene-${currentScene}`);
  }

  //scroll
  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.querySelector('body').setAttribute('id', `show-scene-${currentScene}`);
    }
    if (yOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return; // 모바일 브라우저 바운스 효과로인해 음수처리 되는것 방지

      currentScene--;
      document.querySelector('body').setAttribute('id', `show-scene-${currentScene}`);
    }
    if (enterNewScene) return;
    playAnimation();
  }
  // scroll_animation 처리

  function calculateValue(value, currentOffsetY) {
    let rv;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    //현재 scene에서 스크롤된 범위 비율
    const scrollRetio = currentOffsetY / scrollHeight;
    if (value.length === 3) {
      //start(시작시점)~end(끝나는시점)가 있는 구간 재생값
      const partScrollStart = value[2].start * scrollHeight;
      const partScrollEnd = value[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (currentOffsetY < partScrollStart) {
        rv = value[0];
      } else if (currentOffsetY > partScrollEnd) {
        rv = value[1];
      } else if (currentOffsetY >= partScrollStart && currentOffsetY <= partScrollEnd) {
        rv =
          ((currentOffsetY - partScrollStart) / partScrollHeight) * (value[1] - value[0]) +
          value[0];
      }
    } else {
      //start(시작시점)~end(끝나는시점)가 없이 구간 통틀어서 재생값
      rv = scrollRetio * (value[1] - value[0]) + value[0];
    }
    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentOffsetY = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentOffsetY / scrollHeight;

    switch (currentScene) {
      case 0:
        //messageA
        if (scrollRatio <= 0.22) {
          //fade-in
          objs.messageA.style.opacity = calculateValue(values.messageA_opacity_in, currentOffsetY);
          objs.messageA.style.transform = `translate3d(0,${calculateValue(
            values.messageA_translateY_in,
            currentOffsetY
          )}%,0)`;
        } else {
          //fade-out
          objs.messageA.style.opacity = calculateValue(values.messageA_opacity_out, currentOffsetY);
          objs.messageA.style.transform = `translate3d(0,${calculateValue(
            values.messageA_translateY_out,
            currentOffsetY
          )}%,0)`;
        }
        //messageB
        if (scrollRatio <= 0.42) {
          //fade-in
          objs.messageB.style.opacity = calculateValue(values.messageB_opacity_in, currentOffsetY);
          objs.messageB.style.transform = `translate3d(0,${calculateValue(
            values.messageB_translateY_in,
            currentOffsetY
          )}%,0)`;
        } else {
          //fade-out
          objs.messageB.style.opacity = calculateValue(values.messageB_opacity_out, currentOffsetY);
          objs.messageB.style.transform = `translate3d(0,${calculateValue(
            values.messageB_translateY_out,
            currentOffsetY
          )}%,0)`;
        }
        //messageC
        if (scrollRatio <= 0.62) {
          //fade-in
          objs.messageC.style.opacity = calculateValue(values.messageC_opacity_in, currentOffsetY);
          objs.messageC.style.transform = `translate3d(0,${calculateValue(
            values.messageC_translateY_in,
            currentOffsetY
          )}%,0)`;
        } else {
          //fade-out
          objs.messageC.style.opacity = calculateValue(values.messageC_opacity_out, currentOffsetY);
          objs.messageC.style.transform = `translate3d(0,${calculateValue(
            values.messageC_translateY_out,
            currentOffsetY
          )}%,0)`;
        }
        //messageD
        if (scrollRatio <= 0.82) {
          //fade-in
          objs.messageD.style.opacity = calculateValue(values.messageD_opacity_in, currentOffsetY);
          objs.messageD.style.transform = `translate3d(0,${calculateValue(
            values.messageD_translateY_in,
            currentOffsetY
          )}%,0)`;
        } else {
          //fade-out
          objs.messageD.style.opacity = calculateValue(values.messageD_opacity_out, currentOffsetY);
          objs.messageD.style.transform = `translate3d(0,${calculateValue(
            values.messageD_translateY_out,
            currentOffsetY
          )}%,0)`;
        }

        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
    }
  }
  window.addEventListener('scroll', () => {
    yOffset = window.scrollY;
    scrollLoop();
  });
  window.addEventListener('load', setLayout);
  window.addEventListener('resize', setLayout);
})();
