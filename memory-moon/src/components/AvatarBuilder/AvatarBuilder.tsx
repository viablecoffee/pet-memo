import React, { useState, useRef } from 'react';
import './AvatarBuilder.css';
import { useStore } from '../../store/useStore';
import { avatarAssets, AvatarCategory, getAssetsByCategory, AVATAR_COLORS } from '../../assets/avatarAssets';

interface AvatarBuilderProps {
  isOpen: boolean;
  onClose: () => void;
}

// Default initial state
const defaultAvatarConfig = {
  body: 'body-westie',
  ears: 'ears-westie-stand',
  eyes: 'eyes-westie-open',
  mouth: 'mouth-westie-smell',
  accessory: 'acc-red-bow-2',
  bodyColor: '#ffffff', // White
};

const AvatarBuilder: React.FC<AvatarBuilderProps> = ({ isOpen, onClose }) => {
  const { pet, updatePet } = useStore();
  const [activeCategory, setActiveCategory] = useState<AvatarCategory>('body');
  
  // Try to load existing config if it exists, otherwise default
  const [config, setConfig] = useState(defaultAvatarConfig); 

  const svgRef = useRef<SVGSVGElement>(null);

  if (!isOpen) return null;

  const handleSelectAsset = (categoryId: AvatarCategory, assetId: string) => {
    setConfig(prev => ({ ...prev, [categoryId]: assetId }));
  };

  const handleChangeColor = (color: string) => {
    setConfig(prev => ({ ...prev, bodyColor: color }));
  };

  const handleSave = () => {
    if (!svgRef.current) return;
    
    // Generate data URL from the SVG element
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    // Add xml declaration and encode
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      // Update the pet profile with the new avatar image
      updatePet({
        ...pet,
        avatarUrl: dataUrl
      });
      onClose();
    };
    
    reader.readAsDataURL(blob);
  };

  const renderActiveCategoryOptions = () => {
    // Special case for color tab
    if (activeCategory as string === 'color') {
      return (
        <div className="color-grid">
          {AVATAR_COLORS.map(color => (
            <button
              key={color}
              className={`color-btn ${config.bodyColor === color ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleChangeColor(color)}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      );
    }

    const assets = getAssetsByCategory(activeCategory);
    
    return (
      <div className="options-grid">
        {assets.map(asset => (
          <button
            key={asset.id}
            className={`option-btn ${config[activeCategory as keyof typeof config] === asset.id ? 'selected' : ''}`}
            onClick={() => handleSelectAsset(activeCategory, asset.id)}
            title={asset.name}
          >
            <svg viewBox="0 0 100 100" className="option-preview-svg">
              {asset.renderSVG(activeCategory === 'body' || activeCategory === 'ears' ? config.bodyColor : '')}
            </svg>
          </button>
        ))}
      </div>
    );
  };

  // Helper to render the currently selected part for the main preview canvas
  const renderSelectedPart = (category: AvatarCategory) => {
    const selectedId = config[category as keyof typeof config];
    const asset = avatarAssets.find(a => a.id === selectedId);
    if (!asset) return null;
    return asset.renderSVG(category === 'body' || category === 'ears' ? config.bodyColor : '');
  };

  return (
    <div className="avatar-builder-container">
      <div className="avatar-builder-header">
        <h2>Customize Pet Avatar</h2>
        <button className="close-builder-btn" onClick={onClose}>×</button>
      </div>

        <div className="avatar-builder-content">
          <div className="avatar-preview-section">
            <div className="avatar-preview-canvas">
              {/* Combine SVGs here based on config. Note: viewBox 0 0 100 100 is standard */}
              <svg 
                ref={svgRef}
                viewBox="0 0 100 100" 
                className="avatar-preview-svg"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background circle purely for framing the SVG export */}
                <circle cx="50" cy="50" r="50" fill="#f0f4f8" fillOpacity="0.2"/>
                {/* Layer order matters */}
                {renderSelectedPart('ears')}
                {renderSelectedPart('body')}
                {renderSelectedPart('eyes')}
                {renderSelectedPart('mouth')}
                {renderSelectedPart('accessory')}
              </svg>
            </div>
            <button className="save-avatar-btn" onClick={handleSave}>
              Save Avatar
            </button>
          </div>

          <div className="avatar-controls-section">
            <div className="category-tabs">
              <button 
                className={`category-tab-btn ${activeCategory === 'body' ? 'active' : ''}`}
                onClick={() => setActiveCategory('body')}
              >Body</button>
              <button 
                className={`category-tab-btn ${activeCategory as string === 'color' ? 'active' : ''}`}
                onClick={() => setActiveCategory('color' as any)}
              >Color</button>
              <button 
                className={`category-tab-btn ${activeCategory === 'ears' ? 'active' : ''}`}
                onClick={() => setActiveCategory('ears')}
              >Ears</button>
              <button 
                className={`category-tab-btn ${activeCategory === 'eyes' ? 'active' : ''}`}
                onClick={() => setActiveCategory('eyes')}
              >Eyes</button>
              <button 
                className={`category-tab-btn ${activeCategory === 'mouth' ? 'active' : ''}`}
                onClick={() => setActiveCategory('mouth')}
              >Mouth</button>
              <button 
                className={`category-tab-btn ${activeCategory === 'accessory' ? 'active' : ''}`}
                onClick={() => setActiveCategory('accessory')}
              >Accessory</button>
            </div>
            {renderActiveCategoryOptions()}
          </div>
        </div>
      </div>
  );
};

export default AvatarBuilder;
