import React, { useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../components/DataTable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import { HiOutlinePencilSquare, HiOutlineTrash, HiPlus } from 'react-icons/hi2';
import TextArea from '../components/TextArea';
import {
    reactTsProjectsApi,
    phpProjectsApi,
    netApiProjectsApi,
    BaseProject
} from '../api/projects';
import { uploadImage, getImageUrl, deleteImage } from '../api/FileUpload';



const Projects = () => {
    const queryClient = useQueryClient();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<BaseProject | null>(null);
    const [projectType, setProjectType] = useState<'ReactTsProjects' | 'PhpProjects' | 'NetApiProjects'>('ReactTsProjects');
    const [newProject, setNewProject] = useState<Omit<BaseProject, 'id'> & { projectType: string }>({
        title: '',
        description: '',
        techUsed: '',
        githubUrl: '',
        liveDemoUrl: '',
        imgSrc: '',
        projectType: 'ReactTsProjects'
    });

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // File handling
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Fetch projects
    const { data: reactTsProjects } = useQuery({
        queryKey: ["reactTsProjects"],
        queryFn: () => reactTsProjectsApi.getAll(),
    });

    const { data: phpProjects } = useQuery({
        queryKey: ["phpProjects"],
        queryFn: () => phpProjectsApi.getAll(),
    });

    const { data: netApiProjects } = useQuery({
        queryKey: ["netApiProjects"],
        queryFn: () => netApiProjectsApi.getAll(),
    });

    const projectsData = projectType === 'ReactTsProjects' ? reactTsProjects :
        projectType === 'PhpProjects' ? phpProjects :
            netApiProjects;

    // Columns for DataTable
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'title',
            headerName: 'Title',
            minWidth: 200,
            flex: 1,
        },
        {
            field: 'liveDemoUrl',
            headerName: 'Demo',
            minWidth: 200,
            renderCell: (params) => (
                <a  {...(params.value !== "null" ? { href: params.value } : {})} target="_blank" rel="noopener noreferrer" className="link link-primary">
                    {params.value !== "null" ? "View Demo" : "No demo for this project"}
                </a>
            ),
        },
        {
            field: 'techUsed',
            headerName: 'Technologies',
            minWidth: 150,
        },
      
        {
            field: 'githubUrl',
            headerName: 'GitHub',
            minWidth: 200,
            renderCell: (params) => (
                <a href={params.value} target="_blank" rel="noopener noreferrer" className="link link-primary">
                    View Repository
                </a>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            setSelectedProject(params.row as BaseProject);
                            setIsEditModalOpen(true);
                        }}
                        className="btn btn-square btn-primary btn-sm"
                    >
                        <HiOutlinePencilSquare />
                    </button>
                    <button
                        onClick={() => deleteProjectMutation.mutate(params.row.id)}
                        className="btn btn-square btn-error btn-sm"
                    >
                        <HiOutlineTrash />
                    </button>
                </div>
            ),
        },
    ];

    // Mutations
    const updateProjectMutation = useMutation({
        mutationFn: async (updatedData: BaseProject) => {
            if (file && selectedProject?.imgSrc) {
                const oldFilePath = selectedProject.imgSrc.split('/').pop() || '';
                await deleteImage(oldFilePath);
            }

            if (file) {
                const filePath = await uploadImage(file);
                updatedData.imgSrc = getImageUrl(filePath);
            }

            const projectApi = projectType === "ReactTsProjects" ? reactTsProjectsApi :
                projectType === "PhpProjects" ? phpProjectsApi :
                    netApiProjectsApi;
            return await projectApi.update(updatedData);
        },
        onSuccess: () => {
            toast.success("Project updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["reactTsProjects"] });
            queryClient.invalidateQueries({ queryKey: ["phpProjects"] });
            queryClient.invalidateQueries({ queryKey: ["netApiProjects"] });
            setIsEditModalOpen(false);
            setFile(null);
            setPreview(null);
        },
    });

    const addProjectMutation = useMutation({
        mutationFn: async (projectData: Omit<BaseProject, 'id'> & { projectType: string }) => {
            if (file) {
                const filePath = await uploadImage(file);
                projectData.imgSrc = getImageUrl(filePath);
            }

            const projectApi = projectData.projectType === "ReactTsProjects" ? reactTsProjectsApi :
                projectData.projectType === "PhpProjects" ? phpProjectsApi :
                    netApiProjectsApi;
            return await projectApi.add(projectData);
        },
        onSuccess: () => {
            toast.success("Project added successfully!");
            queryClient.invalidateQueries({ queryKey: ["reactTsProjects"] });
            queryClient.invalidateQueries({ queryKey: ["phpProjects"] });
            queryClient.invalidateQueries({ queryKey: ["netApiProjects"] });
            setIsAddModalOpen(false);
            setNewProject({
                title: '',
                description: '',
                techUsed: '',
                githubUrl: '',
                liveDemoUrl: '',
                imgSrc: '',
                projectType: 'ReactTsProjects'
            });
            setFile(null);
            setPreview(null);
        },
    });

    const deleteProjectMutation = useMutation({
        mutationFn: async (id: number) => {
            const projectApi = projectType === "ReactTsProjects" ? reactTsProjectsApi :
                projectType === "PhpProjects" ? phpProjectsApi :
                    netApiProjectsApi;
            const project = await projectApi.get(id);

            if (project.imgSrc) {
                const filePath = project.imgSrc.split('/').pop() || '';
                await deleteImage(filePath);
            }

            await projectApi.delete(id);
        },
        onSuccess: () => {
            toast.success("Project deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["reactTsProjects"] });
            queryClient.invalidateQueries({ queryKey: ["phpProjects"] });
            queryClient.invalidateQueries({ queryKey: ["netApiProjects"] });
        },
    });

    // Handlers
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedProject) {
            updateProjectMutation.mutate(selectedProject);
        }
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addProjectMutation.mutate(newProject);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSelectedProject(prev => prev ? { ...prev, [name]: value } : null);
    };
    
    const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewProject(prev => ({ ...prev, [name]: value }));
    };
    
    //const handleAddTAInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //    const { name, value } = e.target;
    //    setNewProject(prev => ({ ...prev, [name]: value }));
    //};

    return (
        <div className="w-full p-0 m-0">
            <div className="w-full flex flex-col items-stretch gap-3">
                <div className="w-full flex justify-between mb-5">
                    <h2 className="font-bold text-2xl xl:text-4xl">Projects</h2>
                    <div className="flex gap-2">
                        <select
                            value={projectType}
                            onChange={(e) => setProjectType(e.target.value as any)}
                            className="select select-bordered"
                        >
                            <option value="ReactTsProjects">React/TS Projects</option>
                            <option value="PhpProjects">PHP Projects</option>
                            <option value="NetApiProjects">.NET API Projects</option>
                        </select>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="btn btn-primary"
                        >
                            <HiPlus className="mr-2" /> Add Project
                        </button>
                    </div>
                </div>

                <DataTable
                    slug="projects"
                    columns={columns}
                    rows={projectsData || []}
                    includeActionColumn={false}
                    isOrders={false}
                />

                {/* Edit Modal */}
                <Modal isOpen={isEditModalOpen} onClose={() => {
                    setIsEditModalOpen(false);
                    setFile(null);
                    setPreview(null);
                }}>
                    <h2 className="text-2xl font-bold mb-6">Edit Project</h2>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Project Image</span>
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="file-input file-input-bordered"
                            />
                            {(preview || selectedProject?.imgSrc) && (
                                <img
                                    src={preview || selectedProject?.imgSrc}
                                    alt="Project preview"
                                    className="w-32 h-32 object-cover mt-2"
                                />
                            )}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Title</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={selectedProject?.title || ''}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                required
                            />
                        </div>
                        <TextArea
                            label="Description"
                            name="description"
                            value={selectedProject?.description || ''}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Technologies Used</span>
                            </label>
                            <input
                                type="text"
                                name="techUsed"
                                value={selectedProject?.techUsed || ''}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">GitHub URL</span>
                            </label>
                            <input
                                type="url"
                                name="githubUrl"
                                value={selectedProject?.githubUrl || ''}
                                onChange={handleInputChange}
                                className="input input-bordered"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Live Demo URL</span>
                            </label>
                            <input
                        
                                name="liveDemoUrl"
                                value={selectedProject?.liveDemoUrl || ''}
                                onChange={handleInputChange}
                                className="input input-bordered"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn btn-outline">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {updateProjectMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* Add Modal */}
                <Modal isOpen={isAddModalOpen} onClose={() => {
                    setIsAddModalOpen(false);
                    setFile(null);
                    setPreview(null);
                }}>
                    <h2 className="text-2xl font-bold mb-6">Add New Project</h2>
                    <form onSubmit={handleAddSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Project Type</span>
                            </label>
                            <select
                                name="projectType"
                                value={newProject.projectType}
                                onChange={handleAddInputChange}
                                className="select select-bordered"
                            >
                                <option value="ReactTsProjects">React/TS Project</option>
                                <option value="PhpProjects">PHP Project</option>
                                <option value="NetApiProjects">.NET API Project</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Project Image</span>
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="file-input file-input-bordered"
                                required
                            />
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Project preview"
                                    className="w-32 h-32 object-cover mt-2"
                                />
                            )}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Title</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={newProject.title}
                                onChange={handleAddInputChange}
                                className="input input-bordered"
                                required
                            />
                        </div>
                        <TextArea
                            label="Description"
                            name="description"
                            value={newProject.description || ''}
                            onChange={handleAddInputChange}
                            required
                        />
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Technologies Used</span>
                            </label>
                            <input
                                type="text"
                                name="techUsed"
                                value={newProject.techUsed}
                                onChange={handleAddInputChange}
                                className="input input-bordered"
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">GitHub URL</span>
                            </label>
                            <input
                                type="url"
                                name="githubUrl"
                                value={newProject.githubUrl}
                                onChange={handleAddInputChange}
                                className="input input-bordered"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Live Demo URL</span>
                            </label>
                            <input
                                type="url"
                                name="liveDemoUrl"
                                value={newProject.liveDemoUrl}
                                onChange={handleAddInputChange}
                                className="input input-bordered"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-outline">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {addProjectMutation.isPending ? 'Adding...' : 'Add Project'}
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
};

export default Projects;