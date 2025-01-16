import { Button } from '@mantine/core';
import styles from './ScrollButton.module.css';
import { ArrowDownIcon } from '@radix-ui/react-icons';

interface ScrollButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

export default function ScrollButton({
  isVisible,
  onClick,
}: ScrollButtonProps) {
  return (
    <>
      {isVisible && (
        <Button
          color="gray"
          onClick={onClick}
          className={styles.button}
          leftSection={<ArrowDownIcon />}
        >
          Scroll
        </Button>
      )}
    </>
  );
}
