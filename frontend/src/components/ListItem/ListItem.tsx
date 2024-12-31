import { Link, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { SvgIconComponent } from '@mui/icons-material';

interface CustomListItemProps {
  text: string,
  icon: SvgIconComponent
}

function CustomListItem(props: CustomListItemProps) {
  return (
    <Link href="/" underline="none" color="text.primary">
    <ListItem key={props.text} sx={{padding: '0px 16px'}}>
      <ListItemButton sx={{borderRadius: '8px'}}>
        <ListItemIcon>
          <props.icon />
        </ListItemIcon>
        <ListItemText primary={props.text} />
      </ListItemButton>
    </ListItem>
    </Link>
  )
}

export default CustomListItem;