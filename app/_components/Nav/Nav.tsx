import { NavLink, NavLinkProps } from '@mantine/core';
import Link, { LinkProps } from 'next/link';
import styles from './Nav.module.css';

export default function Nav({ ...props }: NavLinkProps & LinkProps) {
  return (
    <NavLink
      {...props}
      component={Link}
      href={props.href}
      color="green"
      className={styles.nav}
    />
  );
}
