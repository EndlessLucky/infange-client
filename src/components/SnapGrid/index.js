import React, { useState, useEffect, useRef, useCallback } from "react";
import { Motion, spring } from "react-motion";

const gutterPadding = 21;
const clamp = (n, min, max) => Math.max(Math.min(n, max), min);

// define spring motion opts
const springConfig = { stiffness: 300, damping: 50 };
const edgeSize = 100;

function reinsert(arr, from, to) {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

function useEventListener(eventName, handler, element = window) {
  // Create a ref that stores handler
  const savedHandler = useRef();

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Make sure element supports addEventListener
      // On
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      // Create event listener that calls handler function stored in ref

      const eventListener = event => savedHandler.current(event);

      // Add event listener
      element.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
}

let timer = null;

/*
    The following are a couple functions for scroll support while dragging
    neither of them work efficiently so we will have to explore other options
 */
function adjustWindowScroll({ clientY }) {
  const viewportHeight = document.documentElement.clientHeight;
  const edgeBottom = viewportHeight - edgeSize;
  const inTop = clientY < edgeSize;
  const inBottom = clientY > edgeSize;
  if (timer) return;
  if (!(inTop || inBottom)) {
    clearTimeout(timer);
    timer = null;
    return;
  }
  const documentWidth = Math.max(
    document.body.scrollWidth,
    document.body.offsetWidth,
    document.body.clientWidth,
    document.documentElement.scrollWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.body.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );

  // Calculate the maximum scroll offset in each direction. Since you can only
  // scroll the overflow portion of the document, the maximum represents the
  // length of the document that is NOT in the viewport.
  const maxScrollY = documentHeight - viewportHeight;

  (function checkForWindowScroll() {
    clearTimeout(timer);
    timer = null;
    if (adjustWindowScroll()) {
      timer = setTimeout(checkForWindowScroll, 60);
    }
  })();

  function adjustWindowScroll() {
    // Get the current scroll position of the document.
    const currentScrollX = window.pageXOffset;
    const currentScrollY = window.pageYOffset;

    // Determine if the window can be scrolled in any particular direction.
    const canScrollUp = currentScrollY > 0;
    const canScrollDown = currentScrollY < maxScrollY;

    // Since we can potentially scroll in two directions at the same time,
    // let's keep track of the next scroll, starting with the current scroll.
    // Each of these values can then be adjusted independently in the logic
    // below.
    var nextScrollX = currentScrollX;
    var nextScrollY = currentScrollY;

    // As we examine the mouse position within the edge, we want to make the
    // incremental scroll changes more "intense" the closer that the user
    // gets the viewport edge. As such, we'll calculate the percentage that
    // the user has made it "through the edge" when calculating the delta.
    // Then, that use that percentage to back-off from the "max" step value.
    var maxStep = 10;

    // Should we scroll up?
    if (inTop && canScrollUp) {
      var intensity = (edgeSize - clientY) / edgeSize;

      nextScrollY = nextScrollY - maxStep * intensity;

      // Should we scroll down?
    } else if (inBottom && canScrollDown) {
      var intensity = (clientY - edgeBottom) / edgeSize;

      nextScrollY = nextScrollY + maxStep * intensity;
    }

    // Sanitize invalid maximums. An invalid scroll offset won't break the
    // subsequent .scrollTo() call; however, it will make it harder to
    // determine if the .scrollTo() method should have been called in the
    // first place.
    nextScrollY = Math.max(0, Math.min(maxScrollY, nextScrollY));

    if (nextScrollY !== currentScrollY) {
      window.scrollTo(0, nextScrollY);
      return true;
    } else {
      return false;
    }
  }
}

function makeScrollingHandler(threshold) {
  let imageThreshold = Math.max(120, window.innerHeight / 4),
    sectionThreshold = Math.max(140, window.innerHeight / 4),
    currentDY = 0,
    frame;
  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.body.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
  const viewportHeight = document.documentElement.clientHeight;

  function getScrollDY(clientY) {
    var speed;
    if (clientY < threshold) {
      // -1 to 0 as we move from 0 to threshold
      speed = -1 + clientY / threshold;
    } else if (clientY > window.innerHeight - threshold) {
      // 0 to 1 as we move from (innerHeight - threshold) to innerHeight
      speed = 1 - (window.innerHeight - clientY) / threshold;
    } else {
      speed = 0;
    }

    return Math.round(speed * 10);
  }

  function tick() {
    if (
      !currentDY ||
      window.scrollY + currentDY > documentHeight - viewportHeight
    ) {
      frame = null;
      return;
    }

    window.scrollTo(0, window.scrollY + currentDY);
    frame = window.requestAnimationFrame(tick);
  }

  function queueScroll(dy) {
    currentDY = dy;

    if (!frame) {
      frame = window.requestAnimationFrame(tick);
    }
  }

  function cancelScroll() {
    window.cancelAnimationFrame(frame);
    frame = null;
    currentDY = 0;
  }

  return {
    dropTarget: {
      enter: cancelScroll,
      leave: cancelScroll,

      over(item, e) {
        queueScroll(getScrollDY(e.clientY));
      },

      acceptDrop() {
        cancelScroll();
        return false;
      }
    }
  };
}

const SnapGrid = ({ handle = ".handle", children, onOrder }) => {
  const [mouse, setMouse] = useState([0, 0]);
  const [delta, setDelta] = useState([0, 0]);
  const [isPressed, setIsPressed] = useState(false);
  const [lastPress, setLastPress] = useState(null);
  const [order, setOrder] = useState(
    React.Children.map(children, (child, i) => i)
  );
  const [height, setHeight] = useState(0);
  const [screenY, setScreenY] = useState(0);
  const refList = [];
  const scrollHandler = makeScrollingHandler(
    Math.max(80, window.innerHeight / 4)
  );
  let pressTimer;

  useEventListener("touchmove", handleTouchMove);
  useEventListener("touchend", handleMouseUp);
  useEventListener("mousemove", handleMouseMove);
  useEventListener("mouseup", handleMouseUp);

  useEffect(() => {
    setOrder(React.Children.map(children, (child, i) => i));
  }, [children]);

  function hasSomeParentTheClass(element, classname) {
    if (
      typeof element.className == "string" &&
      element.className.split(" ").indexOf(classname) >= 0
    )
      return true;
    return (
      element.parentNode && hasSomeParentTheClass(element.parentNode, classname)
    );
  }

  function handleMouseDown(
    key,
    [pressX, pressY],
    { pageX, pageY, target, clientY }
  ) {
    if (!hasSomeParentTheClass(target, handle.replace(".", ""))) return;

    pressTimer = window.setTimeout(function() {
      setLastPress(key);
      setIsPressed(true);
      setDelta([pageX - pressX, pageY - pressY]);
      setMouse([pressX, pressY]);
    }, 300);
  }

  function handleTouchStart(key, pressLocation, e) {
    handleMouseDown(key, pressLocation, e.touches[0]);
  }

  function handleTouchMove(e) {
    e.preventDefault();
    handleMouseMove(e.touches[0]);
  }

  function handleMouseUp() {
    clearTimeout(pressTimer);
    scrollHandler.dropTarget.leave();
    setIsPressed(false);
    setDelta([0, 0]);
    onOrder(order);
  }

  function handleMouseMove({ pageX, pageY, clientX, clientY }) {
    if (isPressed) {
      //adjustWindowScroll({clientY});
      //scrollHandler.dropTarget.over(null, {clientY});
      let lastPressRef = refList[lastPress];
      if (lastPressRef) {
        let h = Math.floor(refList[lastPress].getBoundingClientRect().height);
        if (h !== height) setHeight(h);

        const mouse = [pageX - delta[0], pageY - delta[1]];
        let currentRow = lastPress;
        let currentTop = lastPressRef.getBoundingClientRect().top;
        let tops = refList
          .map(
            (x, i) =>
              x &&
              (i === lastPress ? currentTop : x.getBoundingClientRect().top)
          )
          .sort();
        currentRow = tops.indexOf(currentTop);
        setMouse(mouse);
        if (currentRow !== order.indexOf(lastPress)) {
          let o = reinsert(order, order.indexOf(lastPress), currentRow);
          setOrder(o);
        }
      }
      setScreenY(window.scrollY);
    }
  }

  return (
    <div style={{ position: "relative" }}>
      {order.map((row, index) => {
        const style =
          lastPress === index && isPressed
            ? {
                scale: spring(1.01, springConfig),
                shadow: spring(4, springConfig),
                y: mouse[1]
              }
            : {
                scale: spring(1, springConfig),
                shadow: spring(1, springConfig),
                y: spring(
                  isPressed && row !== index
                    ? height * (index < order.indexOf(index) ? 1 : -1) * 1.1
                    : 0,
                  springConfig
                )
              };
        return (
          <Motion key={index} style={style}>
            {({ scale, shadow, y }) => (
              <div
                ref={r => (refList[index] = r)}
                onMouseDown={e => handleMouseDown(index, [0, y], e)}
                onTouchStart={() => handleTouchStart(index, [0, y], y)}
                style={{
                  position: "relative",
                  filter: "blur(0)",
                  // boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                  //WebkitTransform: isPressed ? `perspective(1px) translate3d(0, ${y}px, 0) scale3d(${scale},${scale},${scale})` : '',
                  transform: isPressed
                    ? `perspective(1px) translate3d(0, ${y}px, 0) scale(${scale})`
                    : "",
                  zIndex: index === lastPress ? 99 : index
                }}
              >
                {children[index]}
              </div>
            )}
          </Motion>
        );
      })}
    </div>
  );
};

export default SnapGrid;
