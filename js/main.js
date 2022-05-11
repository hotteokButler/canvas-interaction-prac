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
        canvas: document.querySelector('#video-canvas-0'),
        context: document.querySelector('#video-canvas-0').getContext('2d'),
        videoImages: [],
        container: document.querySelector('#scroll-section-0'),
        messageA: document.querySelector('#scroll-section-0 .main-message.a'),
        messageB: document.querySelector('#scroll-section-0 .main-message.b'),
        messageC: document.querySelector('#scroll-section-0 .main-message.c'),
        messageD: document.querySelector('#scroll-section-0 .main-message.d'),
      },
      values: {
        //videoImages
        videoImageCount: 300,
        imageSequence: [0, 299],
        canvasOpacity: [1, 0, { start: 0.88, end: 0.98 }],
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
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-1'),
        content: document.querySelector('#scroll-section-1 .description'),
      },
    },
    //2
    {
      type: TYPE_KEY.sticky,
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-2'),
        messageA: document.querySelector('#scroll-section-2 .a'),
        messageB: document.querySelector('#scroll-section-2 .b'),
        messageC: document.querySelector('#scroll-section-2 .c'),
        pinB: document.querySelector('#scroll-section-2 .b .pin'),
        pinC: document.querySelector('#scroll-section-2 .c .pin'),
        canvas: document.querySelector('#video-canvas-1'),
        context: document.querySelector('#video-canvas-1').getContext('2d'),
        videoImages: [],
      },
      values: {
        videoImageCount: 960,
        imageSequence: [0, 959],
        canvas_opacity_in: [0, 1, { start: 0, end: 0.15 }],
        canvas_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        //
        messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
        messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
        messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
        messageA_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],
        //
        messageB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
        messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
        messageB_translateY_in: [30, 0, { start: 0.5, end: 0.55 }],
        messageB_translateY_out: [0, -20, { start: 0.58, end: 0.63 }],
        //
        messageC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
        messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        messageC_translateY_in: [30, 0, { start: 0.72, end: 0.77 }],
        messageC_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
        //
        pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
        pinB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
        pinB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
        pinC_scaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
        pinC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
        pinC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
      },
    },
    //3
    {
      type: TYPE_KEY.sticky,
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3'),
        canvasCaption: document.querySelector('.canvas-captioin'),
        canvas: document.querySelector('.image-blend-canvas'),
        context: document.querySelector('.image-blend-canvas').getContext('2d'),
        imagesPath: ['./images/blend-image-1.jpg', './images/blend-image-2.jpg'],
        images: [],
      },
      values: {},
    },
  ];

  //canvas

  function setCanvasImages() {
    let imgElem;
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      imgElem = new Image();
      imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
      sceneInfo[0].objs.videoImages.push(imgElem);
    }
    let imgElem2;
    for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
      imgElem2 = new Image();
      imgElem2.src = `./video/002/IMG_${7027 + i}.JPG`;
      sceneInfo[2].objs.videoImages.push(imgElem2);
    }
    let imgElem3;
    for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++) {
      imgElem3 = new Image();
      imgElem3.src = sceneInfo[3].objs.imagesPath[i];
      sceneInfo[3].objs.images.push(imgElem3);
    }
  }
  setCanvasImages();

  //section height
  function setLayout() {
    //각 스크롤 섹션 높이 셋팅
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === TYPE_KEY.sticky) {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === TYPE_KEY.normal) {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.content.offsetHeight + window.innerHeight;
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
    const heightRatio = window.innerHeight / 1080;
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
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
        let sequence = Math.round(calculateValue(values.imageSequence, currentOffsetY));
        objs.context.drawImage(objs.videoImages[sequence], 0, 0);
        objs.canvas.style.opacity = calculateValue(values.canvasOpacity, currentOffsetY);
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

      case 2:
        let sequence2 = Math.round(calculateValue(values.imageSequence, currentOffsetY));
        objs.context.drawImage(objs.videoImages[sequence2], 0, 0);
        if (scrollRatio <= 0.5) {
          //canvas-fade-in
          objs.canvas.style.opacity = calculateValue(values.canvas_opacity_in, currentOffsetY);
        } else {
          //canvas-fade-out
          objs.canvas.style.opacity = calculateValue(values.canvas_opacity_out, currentOffsetY);
        }
        if (scrollRatio <= 0.25) {
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

        if (scrollRatio <= 0.57) {
          //fade-in
          objs.messageB.style.opacity = calculateValue(values.messageB_opacity_in, currentOffsetY);
          objs.messageB.style.transform = `translate3d(0,${calculateValue(
            values.messageB_translateY_in,
            currentOffsetY
          )}%,0)`;
          objs.pinB.style.transform = `scaleY(${calculateValue(
            values.pinB_scaleY,
            currentOffsetY
          )})`;
        } else {
          //fade-out
          objs.messageB.style.opacity = calculateValue(values.messageB_opacity_out, currentOffsetY);
          objs.messageB.style.transform = `translate3d(0,${calculateValue(
            values.messageB_translateY_out,
            currentOffsetY
          )}%,0)`;
          objs.pinB.style.transform = `scaleY(${calculateValue(
            values.pinB_scaleY,
            currentOffsetY
          )})`;
        }

        if (scrollRatio <= 0.83) {
          //fade-in
          objs.messageC.style.opacity = calculateValue(values.messageC_opacity_in, currentOffsetY);
          objs.messageC.style.transform = `translate3d(0,${calculateValue(
            values.messageC_translateY_in,
            currentOffsetY
          )}%,0)`;
          objs.pinC.style.transform = `scaleY(${calculateValue(
            values.pinC_scaleY,
            currentOffsetY
          )})`;
        } else {
          //fade-out
          objs.messageC.style.opacity = calculateValue(values.messageC_opacity_out, currentOffsetY);
          objs.messageC.style.transform = `translate3d(0,${calculateValue(
            values.messageC_translateY_out,
            currentOffsetY
          )}%,0)`;
          objs.pinC.style.transform = `scaleY(${calculateValue(
            values.pinC_scaleY,
            currentOffsetY
          )})`;
        }
        break;
      case 3:
        // 가로 세로 모두 꽉 차게 하기위해 여기서 셋팅(계산)
        const widthRatio = window.innerWidth / objs.canvas.width;
        const heightRatio = window.innerHeight / objs.canvas.height;
        //비율에 따른 canvas scale 지정
        let canvasScaleRatio;

        if (widthRatio <= heightRatio) {
          // 캔버스보다 브라우저 창의 너비가 작은경우
          canvasScaleRatio = heightRatio;
        } else {
          // 캔버스보다 브라우저 창의 너비가 큰 경우
          canvasScaleRatio = widthRatio;
        }

        objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
        objs.context.drawImage(objs.images[0], 0, 0);
        break;
    }
  }
  window.addEventListener('scroll', () => {
    yOffset = window.scrollY;
    scrollLoop();
  });
  window.addEventListener('load', () => {
    setLayout();
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
  });
  window.addEventListener('resize', setLayout);
})();
