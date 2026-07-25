import { Link } from 'react-router-dom'

const recipes = [
  {
    id: 1,
    title: 'Authentic Chole Bhature',
    author: 'Priya K.',
    tags: ['Vegetarian', 'Dinner'],
    summary: 'A family recipe from Punjab, slow-cooked for deep flavor and shared by the community.',
  },
  {
    id: 2,
    title: 'Quick Coconut Chutney',
    author: 'Lakshmi P.',
    tags: ['Vegan', 'Breakfast'],
    summary: 'A simple chutney for idli, dosa, and snack plates.',
  },
  {
    id: 3,
    title: 'Masala Chai for a Crowd',
    author: 'Simran G.',
    tags: ['Tea', 'Gathering'],
    summary: 'Balanced spice, strong tea, and a make-ahead method for hosting.',
  },
]

export default function RecipesPage({ t }) {
  return (
    <section className="recipes-page">
      <div className="page-header food-market-header">
        <div>
          <p className="eyebrow">{t('Recipes')}</p>
          <h1>{t('Community Recipes')}</h1>
        </div>
        <Link to="/food" className="button recipe-nav-button">{t('Back to Bazaar')}</Link>
      </div>

      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <article key={recipe.id} className="recipe-card">
            <p className="eyebrow">{recipe.author}</p>
            <h2>{t(recipe.title)}</h2>
            <p>{t(recipe.summary)}</p>
            <div className="tags">
              {recipe.tags.map((tag) => <span key={tag}>{t(tag)}</span>)}
            </div>
            <button type="button" className="text-button">{t('Read Full Recipe')}</button>
          </article>
        ))}
      </div>
    </section>
  )
}
