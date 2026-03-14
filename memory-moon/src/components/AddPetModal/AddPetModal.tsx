import React, { useState } from 'react';
import './AddPetModal.css';
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
    const [isClosing, setIsClosing] = useState(false);

    if (!isOpen && !isClosing) return null;

    const generateId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
            // Reset form
            setName('');
            setSpecies('dog');
            setGender('male');
            setBreed('');
            setBirthDate(new Date().toISOString().split('T')[0]);
            setColor('');
            setWeight('');
        }, 300);
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
        handleClose();
    };

    return (
        <div className={`modal-overlay ${isClosing ? 'fadeOut' : ''}`} onClick={handleClose}>
            <div
                className={`modal-content pet-modal ${isClosing ? 'scaleDown' : ''}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2 className="modal-title">Add New Pet</h2>
                    <button className="modal-close" onClick={handleClose}>&times;</button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Pet Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Milo"
                            required
                            autoFocus
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

                    <div className="modal-form-footer">
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={!name.trim() || pets.length >= 6}
                        >
                            {pets.length >= 6 ? 'Pet Limit Reached' : 'Welcome to the Star!'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPetModal;
