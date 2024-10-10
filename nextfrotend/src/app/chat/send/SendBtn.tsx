import { Button } from "primereact/button"
interface SendBtnProps {
  sendMsg: () => void;
}
export function SendBtn({sendMsg}:SendBtnProps) {
 
  return(
    <Button onClick={sendMsg}>
        发送按钮
    </Button>
  )
}