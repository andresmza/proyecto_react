// import MUIDataTable from "mui-datatables";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export const TableAxios = () => {
// // 1- configuramos los hooks
//     const {users, setUsers} = useState([])    

// // 2- funcion para mostrar los datos con axios
//     const endPoint = 'https://fakestoreapi.com/users'

// // 3-definimos columns
//     const getData = async () => {
//     await axios.get(endPoint).then((response) => {
//         const data = response.data
//         console.log(data)
//         setUsers(data)
    
//     })

//     }

//     useEffect ( () => {
//         getData()

//     }, [])
//     const colums = [
//         {
//             name:"id",
//             label: "ID"
//         },
//         {
//             name:"name",
//             label: "NAME"
//         },
//         {
//             name:"gender",
//             label: "GENDER"
//         },
//     ]
//     //4- renderizamos la datatable
//     return(
//         <MUIDataTable
//             title="Prueba de usuarios con api fake"
//             columns={columns}
//             data={users}
//         />
//         )
// }
