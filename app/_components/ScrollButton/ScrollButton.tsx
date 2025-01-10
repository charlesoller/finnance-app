import { Button } from "@mantine/core"
interface ScrollButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

export default function ScrollButton({
  isVisible,
  onClick
}: ScrollButtonProps) {
  console.log(isVisible)
  return (
    <>
      {isVisible && <Button
        onClick={onClick}
        style={{ 
          position: "fixed", 
          bottom: "130px", 
          right: "20px", 
        }}
      >
        Scroll to Messages
      </Button>}
    </>
  )
}