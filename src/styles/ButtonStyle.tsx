import { useTheme } from '@mui/material/styles';

export default function ButtonStyle() {
    const theme = useTheme();

    return({
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderRadius: '50px',
        "&:hover" : {
            backgroundColor: theme.palette.primary.light
        }
    })
}