import { useState } from "react"
import { useForm } from "react-hook-form"
import Modal from "./Modal"
import styles from "./OrgChartNode.module.css"
import "./OrgChartNode"

type FormValues = {
    name: string;
    description: string;
    manager_id: number;
};

const RootContent = (props: any) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>();

    const handleOpenAddRootModal = () => {
        setValue("name", "");
        setValue("description", "");
        setIsAddModalOpen(true);
    }

    const handleCloseAddModal = () => setIsAddModalOpen(false);

    const onSubmit = async (vals: any) => {
        vals.manager_id = 0;

        const response = await fetch("http://localhost:5000/orgchart",
                    {
                        method: "POST",
                        headers: {
                           "Content-Type": "application/json", 
                        },
                        body: JSON.stringify(vals)
                    });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        setIsAddModalOpen(false);
        props.loaddata();
    }

    if (props.orgchartlen)
        return(<div><h2>Organization Chart</h2></div>);
    
    return(
        <div>
            <div>
                <h2>Organization Chart</h2>
                <input type="button" className={styles.subbtn} value="Add Root" onClick={ handleOpenAddRootModal }/>
            </div>
            <Modal isOpen={isAddModalOpen} onClose={handleCloseAddModal}>
                <h2>Add Root</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <table>
                        <tbody>
                            <tr>
                                <td> 
                                    <label className={styles.frmlbl}>Manager</label>
                                </td>
                                <td>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className={styles.frmlbl}>Name</label>
                                </td>
                                <td>
                                    <input type="text" 
                                    {...register("name", { required: "Name is required" })} />
                                    <br/>
                                    <label className={styles.suberror}>
                                        {errors.name != null ? errors.name.message : ""}
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className={styles.frmlbl}>Description</label>
                                </td>
                                <td>
                                    <input type="text" size={35} 
                                    {...register("description", { required: "Description is required" })} />
                                    <br/>
                                    <label className={styles.suberror}>
                                        {errors.description && errors.description.message}
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} className={styles.subbtncell}>
                                    <input className={styles.subbtn} type="submit" value="Add" />
                                    <input type="hidden" 
                                    {...register("manager_id") }
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>                
                </form>
            </Modal>
        </div>
    );
}
export default RootContent;