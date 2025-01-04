'use client';

import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { SvgIconComponent } from '@mui/icons-material';
import { usePathname, useRouter } from "next/navigation";

interface CustomListItemProps {
  text: string,
  icon: SvgIconComponent,
  href: string
}

function CustomListItem(props: CustomListItemProps) {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  const isSelected =pathname === props.href;

  function handleNav() {
    router.push(props.href)
  }

  return (
    <ListItem key={props.text} onClick={handleNav} sx={{padding: '0px 16px'}}>
      <ListItemButton
        sx={{
          borderRadius: '8px',
          backgroundColor: isSelected ? '#183d22' : 'transparent',
          color: isSelected ? 'primary.contrastText' : 'text.primary',
        }}>
        <ListItemIcon>
          <props.icon />
        </ListItemIcon>
        <ListItemText primary={props.text} />
      </ListItemButton>
    </ListItem>
  )
}

export default CustomListItem;