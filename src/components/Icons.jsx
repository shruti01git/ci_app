const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  ariaHidden: true,
  focusable: "false",
};

function Icon({ children, className }) {
  return (
    <svg {...iconProps} className={className}>
      {children}
    </svg>
  );
}

export function SearchIcon({ className }) {
  return (
    <Icon className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </Icon>
  );
}

export function CameraIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M4 8.5h3.1c.4 0 .8-.2 1-.5l1.1-1.6c.2-.3.6-.5 1-.5h3.6c.4 0 .8.2 1 .5l1.1 1.6c.2.3.6.5 1 .5H20c.8 0 1.5.7 1.5 1.5v7.5c0 .8-.7 1.5-1.5 1.5H4c-.8 0-1.5-.7-1.5-1.5V10c0-.8.7-1.5 1.5-1.5Z" />
      <circle cx="12" cy="14" r="3.5" />
    </Icon>
  );
}

export function RouteIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M7 6.5h3.5a3 3 0 0 1 3 3V11" />
      <path d="M17 17.5h-3.5a3 3 0 0 1-3-3V13" />
      <circle cx="7" cy="6.5" r="2" />
      <circle cx="17" cy="17.5" r="2" />
    </Icon>
  );
}

export function ActivityIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M4 12h3l2-5 4 10 2-5h5" />
    </Icon>
  );
}

export function ClockIcon({ className }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </Icon>
  );
}

export function MapPinIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M12 21s5-4.4 5-10a5 5 0 1 0-10 0c0 5.6 5 10 5 10Z" />
      <circle cx="12" cy="11" r="1.8" />
    </Icon>
  );
}

export function InfoIcon({ className }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 10.5v6" />
      <path d="M12 7.5h.01" />
    </Icon>
  );
}
