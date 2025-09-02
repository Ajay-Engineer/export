import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axios.config";
import axios from 'axios';

interface Certificate {
  src: string;
  alt: string;
  file?: File;
}

interface Specification {
  "Botanical Source": string;
  Form: string;
  Color: string;
  Moisture: string;
  "Ash Content": string;
  "Shelf Life": string;
  pH: string;
  MOQ: string;
  [key: string]: string;
}

interface FormData {
  title: string;
  slug: string;
  category: string;
  visibility: string;
  shortDescription: string;
  description: string;
  videoUrl: string;
  datasheetUrl: string;
  benefits: Array<{ title: string; description: string }>;
  specifications: Specification;
  packaging: Array<{ title: string; content: string }>;
  certifications: Certificate[];
  faqs: Array<{ q: string; a: string }>;
  related: Array<{ title: string; image: string; link: string }>;
}

interface ProductCreateFormProps {
  isEdit?: boolean;
  product?: any | null;
  onSubmit?: (data: FormData) => void;
  onClose?: () => void;
}

const categories = [
  { name: "Herbal Extract Products", value: "herbal" },
  { name: "Palm Jaggery Products", value: "palm-jaggery" },
  { name: "Coir Products", value: "coir" },
  { name: "Tea Varieties", value: "tea" },
  { name: "Health Mix", value: "health-mix" },
  { name: "Handicrafts", value: "handicraft" },
  { name: "Egg Products", value: "egg" },
] as const;

const RequiredLabel: React.FC<{ label: string }> = ({ label }) => (
  <label className="block font-medium mb-1">
    {label} <span className="text-red-600">*</span>
  </label>
);

const initialForm: FormData = {
  title: "",
  slug: "",
  category: "",
  visibility: "public",
  shortDescription: "",
  description: "",
  videoUrl: "",
  datasheetUrl: "",
  benefits: [{ title: "", description: "" }],
  specifications: {
    "Botanical Source": "",
    Form: "",
    Color: "",
    Moisture: "",
    "Ash Content": "",
    "Shelf Life": "",
    pH: "",
    MOQ: "",
  },
  packaging: [{ title: "", content: "" }],
  certifications: [
    { src: "", alt: "GST", file: undefined },
    { src: "", alt: "FSSAI", file: undefined },
    { src: "", alt: "Export License", file: undefined }
  ],
  faqs: [{ q: "", a: "" }],
  related: [{ title: "", image: "", link: "" }]
};

const ProductCreateForm: React.FC<ProductCreateFormProps> = ({ isEdit = false, product = null, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [imageFiles, setImageFiles] = useState<Array<File | undefined>>([undefined]);
  const [products, setProducts] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Rest of your component code here...

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-8 p-8 bg-white rounded-xl shadow-lg max-w-4xl mx-auto mb-8"
      >
        {/* Your existing JSX here... */}
      </form>
    </>
  );
};

export default ProductCreateForm;
