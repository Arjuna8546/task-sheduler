import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import { format, isSameDay } from 'date-fns'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import 'react-calendar/dist/Calendar.css'
import { addTask, deleteTask, editTask, getTask } from '../endpoints/user_api'
import { useSelector } from 'react-redux'
import Modal from './Modal'
import Header from '../components/Header'
import { toast } from 'sonner'


function HomePage() {
  const [tasks, setTasks] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [editTaskId, setEditTaskId] = useState(null)

  const user = useSelector(state => state.user)

  const fetchTasks = async () => {
    try {
      const res = await getTask(user?.user.id)
      if (res?.data?.success === true) {
        setTasks(res.data.task)
      } else {
        toast.error("Failed to fetch tasks")
      }
    } catch (error) {
      toast.error("Error fetching tasks")
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const formik = useFormik({
    initialValues: {
      task: '',
      date: '',
    },
    validationSchema: Yup.object().shape({
      task: Yup.string()
        .required('Task name is required')
        .test('not-empty', 'Task name cannot be empty or just spaces', value => {
          return value && value.trim().length > 0
        })
        .test('unique-task', 'Task already exists on this date', function (value) {
          const { date } = this.parent
          if (!value || !date) return true

          const currentDate = new Date(date)
          const trimmedValue = value.trim().toLowerCase()
          return !tasks.some(task =>
            isSameDay(new Date(task.scheduledFor), currentDate) &&
            task.name.trim().toLowerCase() === trimmedValue &&
            task.id !== editTaskId
          )
        }),
      date: Yup.string()
        .required('Date and time is required')
        .test('not-past', 'Cannot add task to a past date/time', value => {
          if (!value) return true
          const inputDate = new Date(value)
          const now = new Date()
          return inputDate >= now
        }),
    }),
    onSubmit: async (values) => {
      const updatedTask = {
        name: values.task,
        scheduledFor: new Date(values.date),
        completed: false,
      }

      try {
        let res
        if (editTaskId) {
          res = await editTask(editTaskId, updatedTask)
          if (res?.data?.success) {
            toast.success("Task updated successfully")
            await fetchTasks()
          } else {
            toast.error("Failed to update task")
          }
        } else {
          res = await addTask({ user_id: user?.user?.id, ...updatedTask })
          if (res?.data?.success) {
            toast.success("Task added successfully")
            await fetchTasks()
          } else {
            toast.error("Failed to add task")
          }
        }
      } catch (error) {
        toast.error("Something went wrong")
      }

      closeModal()
    },
    enableReinitialize: true,
  })

  const openModal = (task = null) => {
    if (task) {
      formik.setValues({
        task: task.name,
        date: format(new Date(task.scheduledFor), "yyyy-MM-dd'T'HH:mm"),
      })
      setEditTaskId(task.id)
    } else {
      formik.setValues({ task: '', date: '' })
      setEditTaskId(null)
    }
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    formik.resetForm()
    setEditTaskId(null)
  }

  const toggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id)
    if (task) {
      try {
        const res = await editTask(id, { ...task, completed: !task.completed })
        if (res?.data?.success) {
          toast.success(`Marked as ${!task.completed ? 'completed' : 'incomplete'}`)
          await fetchTasks()
        } else {
          toast.error("Failed to update task status")
        }
      } catch {
        toast.error("Something went wrong")
      }
    }
  }

  const handleDelete = async (id) => {
    try {
      const taskToDelete = tasks.find(task => task.id === id)
      if (!taskToDelete) {
        toast.error("Task not found")
        return
      }
      if (taskToDelete.completed) {
        toast.error("Cannot delete a completed task")
        return
      }
      const res = await deleteTask(id)
      if (res?.data?.success) {
        setTasks(prev => prev.filter(task => task.id !== id))
        toast.success("Task deleted successfully")
      } else {
        toast.error("Failed to delete task")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const tasksForSelectedDate = tasks.filter(task =>
    isSameDay(new Date(task.scheduledFor), selectedDate)
  )

  const tileClassName = ({ date }) => {
    const dayTasks = tasks.filter(task => isSameDay(new Date(task.scheduledFor), date))
    if (dayTasks.length === 0) return ''
    const allCompleted = dayTasks.every(task => task.completed)
    const someCompleted = dayTasks.some(task => task.completed)
    if (allCompleted) return 'completed-day'
    if (someCompleted) return 'mixed-day'
    return 'pending-day'
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Task Calendar</h1>
            <button
              onClick={() => openModal()}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-stone-900"
            >
              + Create Task
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            <div className="md:col-span-2">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={tileClassName}
                className="custom-calendar"
              />
            </div>
            <div className="mt-8 md:mt-0 md:col-span-3">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Tasks for {format(selectedDate, 'PPPP')}
              </h2>
              {tasksForSelectedDate.length === 0 ? (
                <p className="text-gray-500 italic">No tasks scheduled for this day.</p>
              ) : (
                <ul className="space-y-4">
                  {tasksForSelectedDate.map(task => (
                    <li
                      key={task.id}
                      className="flex justify-between items-center bg-white text-gray-800 px-4 py-3 border border-gray-200 rounded-xl shadow-sm"
                    >
                      <div>
                        <p
                          className={`text-lg font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                            }`}
                        >
                          {task.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Time: {format(new Date(task.scheduledFor), 'hh:mm a')}
                        </p>
                      </div>

                      <div className="flex space-x-3 items-center">
                        <button
                          onClick={() => toggleComplete(task.id)}
                          title={task.completed ? 'Undo' : 'Mark Complete'}
                          className={`hover:scale-110 transition-transform ${task.completed ? 'text-green-500' : 'text-yellow-500'
                            }`}
                        >
                          {task.completed ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m6 0l-6 6m6-6l-6-6" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>

                        {!task.completed && (
                          <button
                            onClick={() => openModal(task)}
                            title="Edit"
                            className="text-black hover:scale-110 transition-transform"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 13l6-6 3.536 3.536L12.536 16.5H9v-3.5z" />
                            </svg>
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(task.id)}
                          title="Delete"
                          className="text-red-500 hover:scale-110 transition-transform"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7L5 7M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

            </div>
          </div>
        </div>
        <Modal
          title={editTaskId ? 'Edit Task' : 'Create Task'}
          isOpen={modalOpen}
          onClose={closeModal}
          onSubmit={formik.handleSubmit}
          formik={formik}
        />
      </div>
    </>
  )
}

export default HomePage
