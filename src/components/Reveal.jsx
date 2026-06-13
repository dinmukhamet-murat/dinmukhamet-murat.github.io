import { useInView } from '../hooks';

/* Wraps content that should already be visible by default and is *enhanced*
   with a reveal when it scrolls in (Emil: never gate content on the transition).
   The .reveal/.is-visible CSS lives in global.css. */
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag ref={ref} className={`reveal ${className} ${inView ? 'is-visible' : ''}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
