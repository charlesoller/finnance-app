import { NavLink, NavLinkProps } from '@mantine/core';
import Link, { LinkProps } from 'next/link';
import styles from './Nav.module.css';
import { useChatContextStore } from '../../_stores/ChatContextStore';

export default function Nav({ ...props }: NavLinkProps & LinkProps) {
  const { clearContext } = useChatContextStore();

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    clearContext();
    if (props && props.onClick) {
      props.onClick(e);
    }
  };
  return (
    <NavLink
      {...props}
      component={Link}
      href={props.href}
      color="green"
      className={styles.nav}
      onClick={onClick}
    />
  );
}
