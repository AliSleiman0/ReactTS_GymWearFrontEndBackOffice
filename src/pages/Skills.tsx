import React, { useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../components/DataTable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import { HiOutlinePencilSquare, HiOutlineTrash, HiPlus } from 'react-icons/hi2';
import TextArea from '../components/TextArea';
import { Skill, skillsBApi, skillsFApi, skillsGApi } from '../api/skills';

const Skills = () => {
    const queryClient = useQueryClient();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    const [skillType, setSkillType] = useState<'SkillsF' | 'SkillsG' | 'SkillsB'>('SkillsF');
    const [newSkill, setNewSkill] = useState<{ skillName: string; skillType: 'SkillsF' | 'SkillsB' | 'SkillsG' }>({
        skillName: '',
        skillType: 'SkillsF',
    });

    // Fetch skills
    const { data: frontendSkills } = useQuery({
        queryKey: ["frontendSkills"],
        queryFn: () => skillsFApi.getAll(),
    });

    const { data: backendSkills  } = useQuery({
        queryKey: ["backendSkills"],
        queryFn: () => skillsBApi.getAll(),
    });

    const { data: generalSkills} = useQuery({
        queryKey: ["generalSkills"],
        queryFn: () => skillsGApi.getAll(),
    });

    const skillsData = skillType === 'SkillsF' ? frontendSkills :
        skillType === 'SkillsB' ? backendSkills :
            generalSkills;
 

    // Columns for DataTable
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'skillName',
            headerName: 'Skill Name',
            minWidth: 200,
            flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            setSelectedSkill(params.row as Skill);
                            setIsEditModalOpen(true);
                        }}
                        className="btn btn-square btn-primary btn-sm"
                    >
                        <HiOutlinePencilSquare />
                    </button>
                    <button
                        onClick={() => deleteSkillMutation.mutate(params.row.id)}
                        className="btn btn-square btn-error btn-sm"
                    >
                        <HiOutlineTrash />
                    </button>
                </div>
            ),
        },
    ];

    // Mutations
    const updateSkillMutation = useMutation({
        mutationFn: async (updatedSkill: Skill) => {
            const skillApi = skillType === "SkillsB" ? skillsBApi :
                skillType === "SkillsF" ? skillsFApi :
                    skillsGApi;
            return await skillApi.update(updatedSkill);
        },
        onSuccess: () => {
            toast.success("Skill updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["frontendSkills"] });
            queryClient.invalidateQueries({ queryKey: ["backendSkills"] });
            queryClient.invalidateQueries({ queryKey: ["generalSkills"] });
            setIsEditModalOpen(false);
        },
    });

    const addSkillMutation = useMutation({
        mutationFn: async (newSkill: { skillName: string; skillType: 'SkillsF' | 'SkillsB' | 'SkillsG' }) => {
            const skillApi = newSkill.skillType === "SkillsB" ? skillsBApi :
                newSkill.skillType === "SkillsF" ? skillsFApi :
                    skillsGApi;
            return await skillApi.add({ skillName: newSkill.skillName });
        },
        onSuccess: () => {
            toast.success("Skill added successfully!");
            queryClient.invalidateQueries({ queryKey: ["frontendSkills"] });
            queryClient.invalidateQueries({ queryKey: ["backendSkills"] });
            queryClient.invalidateQueries({ queryKey: ["generalSkills"] });
            setIsAddModalOpen(false);
            setNewSkill({ skillName: '', skillType: 'SkillsF' });
        },
    });

    const deleteSkillMutation = useMutation({
        mutationFn: async (id: number) => {
            const skillApi = skillType === "SkillsB" ? skillsBApi :
                skillType === "SkillsF" ? skillsFApi :
                    skillsGApi;
            await skillApi.delete(id);
        },
        onSuccess: () => {
            toast.success("Skill deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["frontendSkills"] });
            queryClient.invalidateQueries({ queryKey: ["backendSkills"] });
            queryClient.invalidateQueries({ queryKey: ["generalSkills"] });
        },
    });

    // Handlers
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedSkill) {
            updateSkillMutation.mutate(selectedSkill);
        }
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSkill.skillName) {
            addSkillMutation.mutate(newSkill);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSelectedSkill(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewSkill(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="w-full p-0 m-0">
            <div className="w-full flex flex-col items-stretch gap-3">
                <div className="w-full flex justify-between mb-5">
                    <h2 className="font-bold text-2xl xl:text-4xl">Skills</h2>
                    <div className="flex gap-2">
                        <select
                            value={skillType}
                            onChange={(e) => setSkillType(e.target.value as any)}
                            className="select select-bordered"
                        >
                            <option value="SkillsF">Front-end</option>
                            <option value="SkillsB">Back-end</option>
                            <option value="SkillsG">General</option>
                        </select>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="btn btn-primary"
                        >
                            <HiPlus className="mr-2" /> Add Skill
                        </button>
                    </div>
                </div>

                {/* DataTable */}
                <DataTable
                    slug="skills"
                    columns={columns}
                    rows={skillsData || []}
                   
                    includeActionColumn={false}
                    isOrders={false}
                />

                {/* Edit Modal */}
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                    <h2 className="text-2xl font-bold mb-6">Edit Skill</h2>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <TextArea
                            label="Skill Name"
                            name="skillName"
                            value={selectedSkill?.skillName || ''}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn btn-outline">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {updateSkillMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* Add Modal */}
                <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                    <h2 className="text-2xl font-bold mb-6">Add New Skill</h2>
                    <form onSubmit={handleAddSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Skill Name</span>
                            </label>
                            <input
                                type="text"
                                name="skillName"
                                value={newSkill.skillName}
                                onChange={handleAddInputChange}
                                className="input input-bordered"
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Skill Type</span>
                            </label>
                            <select
                                name="skillType"
                                value={newSkill.skillType}
                                onChange={handleAddInputChange}
                                className="select select-bordered"
                            >
                                <option value="SkillsF">Front-end</option>
                                <option value="SkillsB">Back-end</option>
                                <option value="SkillsG">General</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-outline">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {addSkillMutation.isPending ? 'Adding...' : 'Add Skill'}
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
};

export default Skills;