import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import {motion} from "framer-motion";



export default function AddDevice() {
  const token = localStorage.getItem("jwt_token");
  const navigate = useNavigate();

  // --- Device form state ---
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [locations, setLocations] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const [deviceName, setDeviceName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warranty, setWarranty] = useState("");
  const [deviceId, setDeviceId] = useState(null);

  const [newCategory, setNewCategory] = useState("");
  const [newType, setNewType] = useState("");

  // --- Specifications state ---
  const [specTemplates, setSpecTemplates] = useState([]);
  const [specValuesByTemplate, setSpecValuesByTemplate] = useState({});
  const [chosenValues, setChosenValues] = useState({});
  const [newValueByTemplate, setNewValueByTemplate] = useState({});
  const [newTemplateName, setNewTemplateName] = useState("");

  // Fetch dropdown data
  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:8080/api/device/categories", {
      headers: { Authorization: token },
    });
    setCategories(res.data || []);
  };

  const fetchLocations = async () => {
    const res = await axios.get("http://localhost:8080/api/device/locations", {
      headers: { Authorization: token },
    });
    setLocations(res.data || []);
  };

  const fetchTypes = async (catId) => {
    if (!catId) return setTypes([]);
    const res = await axios.get(
      `http://localhost:8080/api/device/types/${catId}`,
      { headers: { Authorization: token } }
    );
    setTypes(res.data || []);
  };

  useEffect(() => {
    fetchCategories();
    fetchLocations();
  }, []);

  useEffect(() => {
    fetchTypes(selectedCategory);
    setSelectedType("");
  }, [selectedCategory]);

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    const res = await axios.post(
      "http://localhost:8080/api/device/add-category",
      { category_name: newCategory.trim() },
      { headers: { Authorization: token } }
    );

    console.log(res.data);
    setNewCategory("");
    await fetchCategories();
    setSelectedCategory(res.data.id);
  };

  // Add new type
  const handleAddType = async () => {
    if (!selectedCategory || !newType.trim()) return;
    const res = await axios.post(
      "http://localhost:8080/api/device/add-type",
      { category_id: +selectedCategory, type_name: newType.trim() },
      { headers: { Authorization: token } }
    );
    setNewType("");
    await fetchTypes(selectedCategory);
    setSelectedType(res.data.id);
  };

  // Submit device
  const handleDeviceSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      "http://localhost:8080/api/device/add",
      {
        device_name: deviceName,
        type_id: +selectedType,
        serial_no: serialNumber,
        model_no: modelNumber,
        purchase_date: purchaseDate,
        warranty_expiry: warranty,
        location_id: +selectedLocation,
        replaced_device_id: null,
      },
      { headers: { Authorization: token } }
    );
    console.log(res.data.deviceId);
    let newDeviceId = res.data.deviceId;
    setDeviceId(newDeviceId);





    // fetch spec templates for this device
    const tmplRes = await axios.get(
      `http://localhost:8080/api/specifications/templates/${selectedType}`,
      { headers: { Authorization: token } }
    );



    console.log(tmplRes.data);
    setSpecTemplates(tmplRes.data || []);

    // fetch values for each template
    tmplRes.data.forEach(async (tmp) => {

      console.log("the template id is ", tmp.template_id);
      const valRes = await axios.post(
        "http://localhost:8080/api/specifications/values",
        { template_id: tmp.template_id },
        { headers: { Authorization: token } }
      );

      console.log("the specification values are " , valRes.data);


      setSpecValuesByTemplate((prev) => ({
        ...prev,
        [tmp.template_id]: valRes.data || [],
      }));
    });
  };

  // Add new spec template
  const handleAddTemplate = async () => {
    if (!newTemplateName.trim() || !selectedType) return;


    const res = await axios.post(

      "http://localhost:8080/api/specifications/add-template",
      { type_id: +selectedType, spec_name: newTemplateName.trim() },
      { headers: { Authorization: token } }
    );

    console.log(res.data);

    const newTmp = { template_id: res.data.spec_template_id, name: newTemplateName };
    setSpecTemplates((prev) => [...prev, newTmp]);
    setNewTemplateName("");
    setSpecValuesByTemplate((prev) => ({ ...prev, [newTmp.template_id]: [] }));
  };

  // Add new spec value
  const handleAddValue = async (template_id) => {
    const val = (newValueByTemplate[template_id] || "").trim();
    if (!val) return;
    const res = await axios.post(
      "http://localhost:8080/api/specifications/add-value",
      { spec_value: val, template_id },
      { headers: { Authorization: token } }
    );

    console.log(res.data);
    setSpecValuesByTemplate((prev) => ({
      ...prev,
      [template_id]: [
        ...(prev[template_id] || []),
        { spec_master_id: res.data.spec_master_id, spec_value: val },
      ],
    }));
    setChosenValues((prev) => ({ ...prev, [template_id]: res.data.spec_master_id }));
    setNewValueByTemplate((prev) => ({ ...prev, [template_id]: "" }));

        // fetch spec templates for this device
    const tmplRes = await axios.get(
      `http://localhost:8080/api/specifications/templates/${selectedType}`,
      { headers: { Authorization: token } }
    );



    console.log(tmplRes.data);
    setSpecTemplates(tmplRes.data || []);

    // fetch values for each template
    tmplRes.data.forEach(async (tmp) => {

      console.log("the template id is ", tmp.template_id);
      const valRes = await axios.post(
        "http://localhost:8080/api/specifications/values",
        { template_id: tmp.template_id },
        { headers: { Authorization: token } }
      );

      console.log("the specification values are " , valRes.data);


      setSpecValuesByTemplate((prev) => ({
        ...prev,
        [tmp.template_id]: valRes.data || [],
      }));

    });


  };

  // Choose spec value
  const handleSpecChange = (template_id, value) => {
    setChosenValues((prev) => ({ ...prev, [template_id]: value }));
  };

  // Submit all specs
  const handleSubmitSpecs = async () => {
    const payload = specTemplates.map((tmp) => ({
      device_id: deviceId,
      spec_template_id: tmp.template_id,
      spec_master_id: parseInt(chosenValues[tmp.template_id]),
    }));
    console.log("Specifications submitted:", payload);
    await axios.post("http://localhost:8080/api/specifications/add", payload, {
      headers: { Authorization: token },
    });



    console.log("Specifications saved!");
    navigate("/view-devices"); // redirect after successful spec submission
  };

return (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    className="min-h-screen bg-white text-black px-4"
  >
    <Navbar />
    <motion.div 
      initial={{ y: 20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ duration: 0.4 }} 
      className="max-w-4xl mx-auto p-8 mt-10 rounded-xl shadow-lg border border-black/10"
    >
      <h1 className="text-3xl font-bold text-center mb-10">Add New Device</h1>

      {!deviceId ? (
        <form 
          onSubmit={handleDeviceSubmit} 
          className="space-y-8"
        >
          {/* Device Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{
              label: "Device Name", value: deviceName, set: setDeviceName
            }, {
              label: "Serial Number", value: serialNumber, set: setSerialNumber
            }, {
              label: "Model Number", value: modelNumber, set: setModelNumber
            }, {
              label: "Purchase Date", value: purchaseDate, set: setPurchaseDate, type: "date"
            }, {
              label: "Warranty Expiry", value: warranty, set: setWarranty, type: "date"
            }].map(({ label, value, set, type = "text" }, i) => (
              <div key={i}>
                <label className="block text-sm font-medium mb-1">{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className="w-full px-3 py-2 border border-black/20 rounded-md bg-white transition focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
            ))}
          </div>

          {/* Category */}
          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 px-3 py-2 border border-black/20 rounded-md bg-white transition focus:ring-2 focus:ring-black"
              required
            >
              <option value="">Category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.category_name}</option>
              ))}
            </select>
            <input
              placeholder="New category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-3 py-2 border border-black/20 rounded-md bg-white transition focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="px-4 py-2 bg-black text-white rounded-md transition hover:opacity-90"
            >
              Add
            </button>
          </div>

          {/* Type */}
          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="flex-1 px-3 py-2 border border-black/20 rounded-md bg-white transition focus:ring-2 focus:ring-black"
              required
            >
              <option value="">Type</option>
              {types.map(t => (
                <option key={t.id} value={t.id}>{t.typename}</option>
              ))}
            </select>
            <input
              placeholder="New type"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="flex-1 px-3 py-2 border border-black/20 rounded-md bg-white transition focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              onClick={handleAddType}
              className="px-4 py-2 bg-black text-white rounded-md transition hover:opacity-90"
            >
              Add
            </button>
          </div>

          {/* Location */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-3 py-2 border border-black/20 rounded-md bg-white transition focus:ring-2 focus:ring-black"
            required
          >
            <option value="">Location</option>
            {locations.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>

          <button
            className="w-full py-3 bg-black text-white font-medium rounded-md transition hover:opacity-90"
          >
            Add Device
          </button>
        </form>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="mt-10 space-y-8"
        >
          <h2 className="text-2xl font-semibold">Add Specifications</h2>

          {/* New Spec Template */}
          <div>
            <label className="block mb-2 font-medium text-sm">New Spec Template</label>
            <div className="flex gap-3">
              <input
                placeholder="Template name"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                className="flex-1 px-3 py-2 border border-black/20 rounded-md bg-white transition focus:ring-2 focus:ring-black"
              />
              <button
                onClick={handleAddTemplate}
                className="px-4 py-2 bg-black text-white rounded-md transition hover:opacity-90"
              >
                Add
              </button>
            </div>
          </div>

          {/* Specification Rows */}
          <div className="space-y-6">
            {specTemplates.map((tmp) => (
              <div key={tmp.template_id}>
                <label className="block mb-2 font-medium">{tmp.name}</label>
                <div className="flex gap-3 items-center">
                  <select
                    value={chosenValues[tmp.template_id] || ""}
                    onChange={(e) =>
                      handleSpecChange(tmp.template_id, e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-black/20 rounded-md bg-white transition focus:ring-2 focus:ring-black"
                  >
                    <option value="">Select value</option>
                    {(specValuesByTemplate[tmp.template_id] || []).map((v) => (
                      <option key={v.id} value={v.value}>{v.value}</option>
                    ))}
                  </select>
                  <input
                    placeholder="New value"
                    value={newValueByTemplate[tmp.template_id] || ""}
                    onChange={(e) =>
                      setNewValueByTemplate((prev) => ({
                        ...prev,
                        [tmp.template_id]: e.target.value,
                      }))
                    }
                    className="flex-1 px-3 py-2 border border-black/20 rounded-md bg-white transition focus:ring-2 focus:ring-black"
                  />
                  <button
                    onClick={() => handleAddValue(tmp.template_id)}
                    className="px-3 py-2 bg-black text-white rounded-md transition hover:opacity-90"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmitSpecs}
            className="w-full mt-4 py-3 bg-black text-white font-medium rounded-md transition hover:opacity-90"
          >
            Submit Specifications
          </button>
        </motion.div>
      )}
    </motion.div>
  </motion.div>
);


}
