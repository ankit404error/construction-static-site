import React, { useState } from 'react';
import './EditModal.css';
import api from '../services/api';

const EditModal = ({ isOpen, onClose, onSave, title, fields, initialData }) => {
    const [formData, setFormData] = useState(initialData || {});
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Sync formData with initialData whenever it changes
    React.useEffect(() => {
        setFormData(initialData || {});
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleArrayChange = (fieldName, index, key, value) => {
        setFormData(prev => {
            const newArray = [...(prev[fieldName] || [])];
            newArray[index] = {
                ...newArray[index],
                [key]: value
            };
            return {
                ...prev,
                [fieldName]: newArray
            };
        });
    };

    const handleImageUpload = async (file, fieldName, index = null, subField = null) => {
        if (!file) return;

        setUploading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const result = await api.uploadImage(file, token);

            if (index !== null && subField) {
                // Array item image update
                handleArrayChange(fieldName, index, subField, result.url);
            } else {
                // Top-level field image update
                handleChange(fieldName, result.url);
            }
        } catch (error) {
            console.error('Image upload failed:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await onSave(formData);
        setSaving(false);
        onClose();
    };

    const renderField = (field) => {
        const { name, label, type, placeholder } = field;

        if (type === 'image') {
            return (
                <div key={name} className="modal-form-group">
                    <label>{label}</label>
                    <div className="image-upload-container">
                        {formData[name] && (
                            <img src={formData[name]} alt="Preview" className="image-preview" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e.target.files[0], name)}
                            disabled={uploading}
                        />
                        {uploading && <span className="uploading-text">Uploading...</span>}
                    </div>
                    <input
                        type="text"
                        value={formData[name] || ''}
                        onChange={(e) => handleChange(name, e.target.value)}
                        placeholder="Or enter image URL manually"
                        className="mt-2"
                    />
                </div>
            );
        }

        if (type === 'textarea') {
            return (
                <div key={name} className="modal-form-group">
                    <label>{label}</label>
                    <textarea
                        value={formData[name] || ''}
                        onChange={(e) => handleChange(name, e.target.value)}
                        placeholder={placeholder}
                        rows={4}
                    />
                </div>
            );
        }

        if (type === 'array') {
            const items = formData[name] || [];

            return (
                <div key={name} className="modal-form-group">
                    <label>{label}</label>
                    {items.length === 0 && <p>No items found</p>}
                    {items.map((item, index) => (
                        <div key={index} className="array-item-vertical">
                            <div className="array-item-header">
                                <span>Item {index + 1}</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => {
                                            const newArray = [...(prev[name] || [])];
                                            newArray.splice(index, 1);
                                            return { ...prev, [name]: newArray };
                                        });
                                    }}
                                    className="remove-item-button"
                                >
                                    Remove
                                </button>
                            </div>
                            {field.subFields.map(subField => {
                                const isDescription = subField.name === 'description';
                                const isSelect = subField.type === 'select';
                                const isImage = subField.type === 'image' || subField.name === 'image' || subField.name === 'icon' || subField.name.includes('image');

                                if (isImage) {
                                    return (
                                        <div key={subField.name} className="subfield-group">
                                            <label className="text-xs text-gray-500">{subField.placeholder}</label>
                                            <div className="image-upload-container-small">
                                                {item[subField.name] && (
                                                    <img src={item[subField.name]} alt="Preview" className="image-preview-small" />
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e.target.files[0], name, index, subField.name)}
                                                    disabled={uploading}
                                                />
                                                {uploading && <span className="uploading-text">Uploading...</span>}
                                            </div>
                                            <input
                                                type="text"
                                                value={item[subField.name] || ''}
                                                onChange={(e) => handleArrayChange(name, index, subField.name, e.target.value)}
                                                placeholder={subField.placeholder}
                                            />
                                        </div>
                                    );
                                }

                                if (isSelect) {
                                    return (
                                        <select
                                            key={subField.name}
                                            value={item[subField.name] || ''}
                                            onChange={(e) => handleArrayChange(name, index, subField.name, e.target.value)}
                                            className="array-select"
                                        >
                                            <option value="">Select {subField.placeholder}</option>
                                            {subField.options.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    );
                                }

                                return isDescription ? (
                                    <textarea
                                        key={subField.name}
                                        value={item[subField.name] || ''}
                                        onChange={(e) => handleArrayChange(name, index, subField.name, e.target.value)}
                                        placeholder={subField.placeholder}
                                        rows={3}
                                        className="array-textarea"
                                    />
                                ) : (
                                    <input
                                        key={subField.name}
                                        type="text"
                                        value={item[subField.name] || ''}
                                        onChange={(e) => handleArrayChange(name, index, subField.name, e.target.value)}
                                        placeholder={subField.placeholder}
                                    />
                                );
                            })}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => {
                            setFormData(prev => {
                                const newArray = [...(prev[name] || [])];
                                const newItem = {};
                                field.subFields.forEach(sf => {
                                    newItem[sf.name] = sf.defaultValue !== undefined ? sf.defaultValue : '';
                                });
                                newArray.push(newItem);
                                return { ...prev, [name]: newArray };
                            });
                        }}
                        className="add-item-button"
                    >
                        + Add New Item
                    </button>
                </div>
            );
        }

        if (type === 'object') {
            const objectData = formData[name] || {};

            return (
                <div key={name} className="modal-form-group border p-4 rounded bg-gray-50">
                    <label className="font-bold mb-2 block">{label}</label>
                    <div className="pl-2 border-l-2 border-blue-200">
                        {field.subFields.map(subField => {
                            // Create a synthetic field object for the subfield
                            // We need to handle the change differently for nested objects

                            const subFieldName = subField.name;
                            const subFieldLabel = subField.label || subField.name;

                            return (
                                <div key={subFieldName} className="mb-3">
                                    <label className="text-sm text-gray-600 block mb-1">{subFieldLabel}</label>
                                    <input
                                        type="text"
                                        value={objectData[subFieldName] || ''}
                                        onChange={(e) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                [name]: {
                                                    ...prev[name],
                                                    [subFieldName]: e.target.value
                                                }
                                            }));
                                        }}
                                        placeholder={subField.placeholder}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        return (
            <div key={name} className="modal-form-group">
                <label>{label}</label>
                <input
                    type={type || 'text'}
                    value={formData[name] || ''}
                    onChange={(e) => handleChange(name, e.target.value)}
                    placeholder={placeholder}
                />
            </div>
        );
    };

    return (
        <div className="edit-modal-overlay" onClick={onClose}>
            <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="edit-modal-header">
                    <h2>{title}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="edit-modal-form">
                    {fields.map(renderField)}

                    <div className="edit-modal-actions">
                        <button type="button" onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                        <button type="submit" className="save-button" disabled={saving || uploading}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModal;
