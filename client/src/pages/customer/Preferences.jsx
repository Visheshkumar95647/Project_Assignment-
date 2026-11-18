import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    getPreferencesApi,
    updatePreferencesApi,
    addFavoriteCategoryApi,
    removeFavoriteCategoryApi,
} from "../../api/preferenceApi";

import { getCategoriesApi } from "../../api/categoryApi";

import Loader from "../../components/Loader/Loader";

const DIETARY_OPTIONS = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Keto",
    "Paleo",
    "Low Sugar",
    "High Protein",
];

const Preferences = () => {
    const [preference, setPreference] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedDietaries, setSelectedDietaries] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            const [prefData, categoryData] = await Promise.all([
                getPreferencesApi(),
                getCategoriesApi(),
            ]);

            setPreference(prefData);
            setCategories(categoryData);

            if (prefData.dietary_restrictions) {
                setSelectedDietaries(
                    prefData.dietary_restrictions
                        .split(",")
                        .map((d) => d.trim())
                );
            }
        } catch (error) {
            console.error("Failed to load preferences:", error);
            toast.error("Failed to load preferences");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleDietary = (dietary) => {
        setSelectedDietaries((prev) =>
            prev.includes(dietary)
                ? prev.filter((d) => d !== dietary)
                : [...prev, dietary]
        );
    };

    const handleSavePreferences = async () => {
        try {
            setSaving(true);

            const payload = {
                dietary_restrictions:
                    selectedDietaries.length > 0
                        ? selectedDietaries.join(", ")
                        : null,
            };

            const updated = await updatePreferencesApi(payload);

            setPreference(updated);

            toast.success("Preferences saved successfully!");
        } catch (error) {
            console.error("Error saving preferences:", error);
            toast.error("Failed to save preferences");
        } finally {
            setSaving(false);
        }
    };

    const handleToggleFavoriteCategory = async (categoryId) => {
        try {
            const isFavorite =
                preference?.favorite_categories?.some(
                    (category) => category.id === categoryId
                );

            let updated;

            if (isFavorite) {
                updated = await removeFavoriteCategoryApi(categoryId);
            } else {
                updated = await addFavoriteCategoryApi(categoryId);
            }

            setPreference(updated);

            toast.success(
                isFavorite
                    ? "Category removed from favorites!"
                    : "Category added to favorites!"
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to update favorite category");
        }
    };

    if (loading) {
        return <Loader />;
    }

    const favoriteCategoryIds =
        preference?.favorite_categories?.map((category) => category.id) || [];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">
                My Preferences
            </h1>

            {/* Dietary Restrictions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">
                    Dietary Restrictions
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                    {DIETARY_OPTIONS.map((dietary) => (
                        <button
                            key={dietary}
                            type="button"
                            onClick={() =>
                                handleToggleDietary(dietary)
                            }
                            className={`p-3 rounded-lg border-2 transition ${
                                selectedDietaries.includes(dietary)
                                    ? "border-primary-500 bg-primary-50 text-primary-700"
                                    : "border-gray-300 bg-white text-gray-700 hover:border-primary-300"
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedDietaries.includes(
                                    dietary
                                )}
                                onChange={() => {}}
                                className="mr-2"
                            />
                            {dietary}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleSavePreferences}
                    disabled={saving}
                    className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition disabled:opacity-60 font-medium"
                >
                    {saving
                        ? "Saving..."
                        : "Save Dietary Preferences"}
                </button>
            </div>

            {/* Favorite Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">
                    Favorite Categories
                </h2>

                {categories.length === 0 ? (
                    <p className="text-gray-600">
                        No categories available
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categories.map((category) => {
                            const isFavorite =
                                favoriteCategoryIds.includes(
                                    category.id
                                );

                            return (
                                <div
                                    key={category.id}
                                    className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                                        isFavorite
                                            ? "border-primary-500 bg-primary-50"
                                            : "border-gray-300 bg-white hover:border-primary-300"
                                    }`}
                                    onClick={() =>
                                        handleToggleFavoriteCategory(
                                            category.id
                                        )
                                    }
                                >
                                    {category.image_url && (
                                        <img
                                            src={category.image_url}
                                            alt={category.name}
                                            className="w-full h-24 object-cover rounded mb-2"
                                        />
                                    )}

                                    <h3 className="font-semibold text-center text-gray-900">
                                        {category.name}
                                    </h3>

                                    <p className="text-xs text-gray-600 text-center mt-1">
                                        {isFavorite
                                            ? "★ Favorite"
                                            : "Add to favorites"}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Preferences;