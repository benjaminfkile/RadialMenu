interface I_MenuItem {
    title: string;
    icon: string;
    color?: string
    callback: () => void;
  }

  export default I_MenuItem