import { useState } from 'react';

const categories = [
  'Hardware',
  'Software',
  'Network',
  'Access',
  'Email',
  'Other',
];

const priorities = [
  'Low',
  'Medium',
  'High',
  'Critical',
];

const initialValues = {
  title: '',
  description: '',
  category: '',
  priority: 'Medium',
  requester: '',
};

function TicketForm({ onSubmit, submitting = false }) {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: '',
      }));
    }
  }

  function validate() {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
    } else if (formData.title.trim().length > 150) {
      newErrors.title = 'Title must not exceed 150 characters.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required.';
    }

    if (!formData.requester.trim()) {
      newErrors.requester = 'Requester is required.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      priority: formData.priority,
      requester: formData.requester.trim(),
    });
  }

  return (
    <form className="ticket-form" onSubmit={handleSubmit} noValidate>
      <div className="ticket-form__field">
        <label htmlFor="title">
          Title <span className="required">*</span>
        </label>

        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter a short description of the issue"
          disabled={submitting}
          aria-invalid={Boolean(errors.title)}
        />

        {errors.title && (
          <p className="ticket-form__error">{errors.title}</p>
        )}
      </div>

      <div className="ticket-form__field">
        <label htmlFor="description">
          Description <span className="required">*</span>
        </label>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the issue in detail..."
          rows="6"
          disabled={submitting}
          aria-invalid={Boolean(errors.description)}
        />

        {errors.description && (
          <p className="ticket-form__error">
            {errors.description}
          </p>
        )}
      </div>

      <div className="ticket-form__grid">
        <div className="ticket-form__field">
          <label htmlFor="category">
            Category <span className="required">*</span>
          </label>

          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={submitting}
            aria-invalid={Boolean(errors.category)}
          >
            <option value="">Select category</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {errors.category && (
            <p className="ticket-form__error">
              {errors.category}
            </p>
          )}
        </div>

        <div className="ticket-form__field">
          <label htmlFor="priority">Priority</label>

          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            disabled={submitting}
          >
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ticket-form__field">
        <label htmlFor="requester">
          Requester <span className="required">*</span>
        </label>

        <input
          id="requester"
          name="requester"
          type="text"
          value={formData.requester}
          onChange={handleChange}
          placeholder="Enter requester name"
          disabled={submitting}
          aria-invalid={Boolean(errors.requester)}
        />

        {errors.requester && (
          <p className="ticket-form__error">
            {errors.requester}
          </p>
        )}
      </div>

      <div className="ticket-form__actions">
        <button
          type="submit"
          className="btn btn--primary"
          disabled={submitting}
        >
          {submitting ? 'Creating...' : 'Create Ticket'}
        </button>
      </div>
    </form>
  );
}

export default TicketForm;