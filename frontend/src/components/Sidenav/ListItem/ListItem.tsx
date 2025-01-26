'use client';

import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { SvgIconComponent } from '@mui/icons-material';
import { usePathname, useRouter } from "next/navigation";
import { setSort } from "@store/slices/filterSlice";
import { useSelector } from "react-redux";
import store, { RootState } from "@store";
import { openLoginDialog } from "@store/slices/loginDialogSlice";

interface CustomListItemProps {
  text: string,
  icon: SvgIconComponent,
  href?: string
}

function CustomListItem(props: CustomListItemProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { sort } = useSelector((state: RootState) => state.filters)
  const username = useSelector((state: RootState) => state.auth.username);
  const isSelected = sort === props.text.toLowerCase() || pathname === props.href?.toLowerCase() || pathname === props.text.toLowerCase();

  function handleNav() {
    if (props.href) {
      router.push(props.href.toLowerCase())
    } else if (props.text == "Recent") {
      alert("view histroy of threads not yet implemented")
    } else if (props.text == "Saved") {
      if (username) {
        router.push("/saved")
      } else {
        store.dispatch(openLoginDialog());
      }
    } else {
      router.push("/")
      store.dispatch(setSort(props.text.toLowerCase()))
    }
  }

  return (
    <ListItem key={props.text} onClick={handleNav} sx={{padding: '0px 16px'}}>
      <ListItemButton
        sx={{
          borderRadius: '8px',
          backgroundColor: isSelected ? '#183d22' : 'transparent',
          color: isSelected ? 'primary.contrastText' : 'text.primary',
          margin: '3px'
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