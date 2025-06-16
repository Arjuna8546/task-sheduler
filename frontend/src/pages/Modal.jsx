
import React from 'react'

function Modal({ 
  isOpen, 
  title, 
  onClose, 
  onSubmit, 
  formik 
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm backdrop-brightness-75">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="task"
              placeholder="Task name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg "
              value={formik.values.task}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.task && formik.errors.task && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.task}</p>
            )}
          </div>

          <div>
            <input
              type="datetime-local"
              name="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg "
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.date && formik.errors.date && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.date}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-stone-900"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Modal
