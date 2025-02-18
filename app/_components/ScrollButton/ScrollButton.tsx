import { Button } from '@mantine/core';
import styles from './ScrollButton.module.css';
import { ArrowDownIcon } from '@radix-ui/react-icons';

interface ScrollButtonProps {
  isVisible: boolean;
  onClick: () => void;
  left?: number;
}

export default function ScrollButton({
  isVisible,
  onClick,
  left = 50,
}: ScrollButtonProps) {
  return (
    <>
      {isVisible && (
        <Button
          color="green"
          variant="light"
          onClick={onClick}
          className={styles.button}
          leftSection={<ArrowDownIcon />}
          style={{
            left: `${left}%`,
          }}
        >
          Scroll
        </Button>
      )}
    </>
  );
}
