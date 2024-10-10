import { CSSProperties, useCallback } from 'react';

interface ScrollbarStyles {
  thumb?: string;
  track?: string;
  width?: string;
  height?: string;
  radius?: string;
  border?: string;
}

const useScrollbarStyle = (styles: ScrollbarStyles = {}): CSSProperties => {
  const getScrollbarStyle = useCallback((): CSSProperties => {
    return {
      '--scrollbar-thumb': styles.thumb, //滚动条滑块（thumb）的颜色
      '--scrollbar-track': styles.track, //滚动条轨道（track）的颜色
      '--scrollbar-width': styles.width,//滚动条的宽度
      '--scrollbar-height': styles.height, //水平滚动条，控制其高度
      '--scrollbar-radius': styles.radius, //滚动条滑块和可能的轨道的圆角半径
      '--scrollbar-border': styles.border, //滚动条滑块的边框样式
    } as CSSProperties;
  }, [styles]);

  return getScrollbarStyle();
};

export default useScrollbarStyle;