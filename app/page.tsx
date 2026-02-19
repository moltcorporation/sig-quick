'use client';

import { useState } from 'react';

interface SignatureElement {
  id: string;
  type: 'text' | 'input' | 'divider';
  label: string;
  value: string;
  placeholder?: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  elements: SignatureElement[];
}

const TEMPLATES: Template[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple',
    elements: [
      { id: '1', type: 'input', label: 'Name', value: '', placeholder: 'Your Name' },
      { id: '2', type: 'input', label: 'Title', value: '', placeholder: 'Your Title' },
      { id: '3', type: 'input', label: 'Email', value: '', placeholder: 'email@company.com' },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Full contact details',
    elements: [
      { id: '1', type: 'input', label: 'Name', value: '', placeholder: 'Your Name' },
      { id: '2', type: 'input', label: 'Title', value: '', placeholder: 'Your Title' },
      { id: '3', type: 'input', label: 'Company', value: '', placeholder: 'Company Name' },
      { id: '4', type: 'divider', label: 'Divider', value: '' },
      { id: '5', type: 'input', label: 'Email', value: '', placeholder: 'email@company.com' },
      { id: '6', type: 'input', label: 'Phone', value: '', placeholder: '+1 (555) 123-4567' },
      { id: '7', type: 'input', label: 'Website', value: '', placeholder: 'www.company.com' },
    ],
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Stylish and contemporary',
    elements: [
      { id: '1', type: 'input', label: 'Name', value: '', placeholder: 'Your Name' },
      { id: '2', type: 'input', label: 'Title', value: '', placeholder: 'Your Title' },
      { id: '3', type: 'divider', label: 'Divider', value: '' },
      { id: '4', type: 'input', label: 'Email', value: '', placeholder: 'email@company.com' },
      { id: '5', type: 'input', label: 'Phone', value: '', placeholder: '+1 (555) 123-4567' },
      { id: '6', type: 'input', label: 'Company', value: '', placeholder: 'Company Name' },
    ],
  },
];

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('professional');
  const [elements, setElements] = useState<SignatureElement[]>(
    TEMPLATES[1].elements
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplate)!;

  const handleTemplateChange = (templateId: string) => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setElements([...template.elements]);
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setElements(
      elements.map((el) => (el.id === id ? { ...el, value } : el))
    );
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newElements = [...elements];
    const draggedElement = newElements[draggedIndex];
    newElements.splice(draggedIndex, 1);
    newElements.splice(index, 0, draggedElement);
    setDraggedIndex(index);
    setElements(newElements);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const generateHTML = () => {
    let html = '<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">\n';

    elements.forEach((element) => {
      if (element.type === 'divider') {
        html += '<tr><td height="10"></td></tr>\n';
        html += '<tr><td style="border-top: 1px solid #ccc;" height="1"></td></tr>\n';
        html += '<tr><td height="10"></td></tr>\n';
      } else if (element.type === 'input' && element.value) {
        html += '<tr><td style="padding: 2px 0;">';
        if (element.label === 'Email') {
          html += `<a href="mailto:${element.value}" style="color: #0066cc; text-decoration: none;">${element.value}</a>`;
        } else if (element.label === 'Phone') {
          html += `<a href="tel:${element.value}" style="color: #0066cc; text-decoration: none;">${element.value}</a>`;
        } else if (element.label === 'Website') {
          html += `<a href="${element.value}" target="_blank" style="color: #0066cc; text-decoration: none;">${element.value}</a>`;
        } else {
          html += element.value;
        }
        html += '</td></tr>\n';
      }
    });

    html += '</table>';
    return html;
  };

  const copyToClipboard = () => {
    const html = generateHTML();
    navigator.clipboard.writeText(html).then(() => {
      alert('HTML copied to clipboard!');
    });
  };

  const downloadHTML = () => {
    const html = generateHTML();
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/html;charset=utf-8,' + encodeURIComponent(html)
    );
    element.setAttribute('download', 'signature.html');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sig.Quick</h1>
          <p className="text-lg text-gray-600">Create professional email signatures in 2 minutes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Editor */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Build Your Signature</h2>

            {/* Template Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                Choose Template
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateChange(template.id)}
                    className={`p-4 rounded-lg border-2 transition text-left ${
                      selectedTemplate === template.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{template.name}</p>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Draggable Elements */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                Edit & Arrange
              </h3>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                {elements.map((element, index) => (
                  <div
                    key={element.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`p-4 rounded-lg border-2 transition cursor-move ${
                      draggedIndex === index
                        ? 'border-indigo-600 bg-indigo-50 opacity-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">⋮</span>
                      <p className="text-sm font-semibold text-gray-700">{element.label}</p>
                    </div>

                    {element.type === 'divider' ? (
                      <div className="border-t border-gray-300"></div>
                    ) : (
                      <input
                        type="text"
                        placeholder={element.placeholder || element.label}
                        value={element.value}
                        onChange={(e) => handleInputChange(element.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Preview</h2>

              {/* Preview Box */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-lg border-2 border-gray-200 mb-8 min-h-48">
                <div className="font-sans text-sm text-gray-900 space-y-1">
                  {elements.map((element) => (
                    <div key={element.id}>
                      {element.type === 'divider' ? (
                        <div className="my-2 border-t border-gray-300"></div>
                      ) : element.value ? (
                        <div>
                          {element.label === 'Email' ? (
                            <a href={`mailto:${element.value}`} className="text-blue-600 hover:underline">
                              {element.value}
                            </a>
                          ) : element.label === 'Phone' ? (
                            <a href={`tel:${element.value}`} className="text-blue-600 hover:underline">
                              {element.value}
                            </a>
                          ) : element.label === 'Website' ? (
                            <a href={element.value} target="_blank" className="text-blue-600 hover:underline">
                              {element.value}
                            </a>
                          ) : (
                            <div>{element.value}</div>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-400 italic">{element.placeholder}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={copyToClipboard}
                  className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
                >
                  📋 Copy HTML to Clipboard
                </button>
                <button
                  onClick={downloadHTML}
                  className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                >
                  ⬇️ Download as HTML
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-sm text-blue-900 mb-2">
                <span className="font-semibold">💡 Tip:</span> This HTML works in Gmail, Outlook, Apple Mail, and more.
              </p>
              <p className="text-xs text-blue-800">
                Paste the HTML directly into your email signature settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
