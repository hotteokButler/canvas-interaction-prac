// global key

const TYPE_KEY = Object.freeze({
  sticky: 'sticky',
  normal: 'normal',
});

(() => {
  const sceneInfo = [
    //0
    {
      type: TYPE_KEY.sticky,
      // 브라우저 높이의 5배로 scrollHeight 세팅 (각 기기가 가진 높이를 읽어와서 그 높이 x5를 해줌으로써 여러가지 종류의 디바이스에서 같은 경험을 할 수 있게 해줌)
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-0'),
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

  function setLayout() {
    //각 스크롤 섹션 높이 셋팅
    for (let i = 0; i < sceneInfo.length; i++) {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }
  }
  window.addEventListener('resize', setLayout);
  setLayout();
})();
