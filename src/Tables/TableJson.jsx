import MUIDataTable from "mui-datatables";
import users from './users.json'




const columns = [
    {   
        name:"id",
        label:"ID"
    },
    {   
        name:"name",
        label:"NAME"
    },
    {   
        name:"email",
        label:"EMAIL"
    }
]
const options={}
export const TableJson = () => {
    
    
    return  (
        <MUIDataTable
        title="Lista de Usuarios"
        data={users}
        columns={columns}
        options={options}
        />

        )
}

                          