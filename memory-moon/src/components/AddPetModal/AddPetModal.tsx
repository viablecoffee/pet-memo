import React, { useState, useEffect } from 'react';
import './AddPetModal.css';
import Modal from '../Modal/Modal';
import { useStore } from '../../store/useStore';
import type { Pet } from '../../types';

interface AddPetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddPetModal: React.FC<AddPetModalProps> = ({ isOpen, onClose }) => {
    const { addPet, pets } = useStore();
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('dog');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [breed, setBreed] = useState('');
    const [birthDate, setBirthDate] = useState(new Date().toISOString().split('T')[0]);
    const [color, setColor] = useState('');
    const [weight, setWeight] = useState('');

    // Reset the form each time it opens.
    useEffect(() => {
        if (isOpen) {
            setName('');
            setSpecies('dog');
            setGender('male');
            setBreed('');
            setBirthDate(new Date().toISOString().split('T')[0]);
            setColor('');
            setWeight('');
        }
    }, [isOpen]);

    const generateId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const newPet: Pet = {
            id: generateId(),
            name: name.trim(),
            species,
            gender,
            breed: breed.trim() || 'Unknown',
            birthDate,
            color: color.trim() || 'Unknown',
            weight: weight.trim() || 'Unknown',
            hobbies: '',
            favoriteFood: '',
            avatarUrl: '/assets/images/milo_avatar.jpg',
        };

        addPet(newPet);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Pet"
            contentClassName="pet-modal"
            footer={
                <button
                    type="submit"
                    form="add-pet-form"
                    className="submit-btn"
                    disabled={!name.trim() || pets.length >= 6}
                >
                    {pets.length >= 6 ? 'Pet Limit Reached' : 'Welcome to the Star!'}
                </button>
            }
        >
            <form id="add-pet-form" className="modal-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Pet Name *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Milo"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Species</label>
                        <select value={species} onChange={e => setSpecies(e.target.value)}>
                            <option value="dog">Dog</option>
                            <option value="cat">Cat</option>
                            <option value="bird">Bird</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Gender</label>
                        <select value={gender} onChange={e => setGender(e.target.value as 'male' | 'female')}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Breed</label>
                    <input
                        type="text"
                        value={breed}
                        onChange={e => setBreed(e.target.value)}
                        placeholder="e.g. Golden Retriever"
                    />
                </div>

                <div className="form-group">
                    <label>Birth Date</label>
                    <input
                        type="date"
                        value={birthDate}
                        onChange={e => setBirthDate(e.target.value)}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Color</label>
                        <input
                            type="text"
                            value={color}
                            onChange={e => setColor(e.target.value)}
                            placeholder="e.g. Golden"
                        />
                    </div>
                    <div className="form-group">
                        <label>Weight</label>
                        <input
                            type="text"
                            value={weight}
                            onChange={e => setWeight(e.target.value)}
                            placeholder="e.g. 25 kg"
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default AddPetModal;
