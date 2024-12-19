import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

interface CustomListItemProps {
  text: string
}

function CustomListItem(props: CustomListItemProps) {
  return (
    <ListItem key={props.text} sx={{padding: '0px 16px'}}>
      <ListItemButton sx={{borderRadius: '8px'}}>
        <ListItemIcon>
          filler
        </ListItemIcon>
        <ListItemText primary={props.text} />
      </ListItemButton>
    </ListItem>
  )
}

export default CustomListItem;