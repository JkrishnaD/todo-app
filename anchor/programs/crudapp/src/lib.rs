#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("BRXt2Utc5TpK68EAvtFHwJKPR7DYWNsSaQEubMEusVfa");

const ANCHOR_DISCRIMINANT_SIZE: usize = 8;

#[program]
pub mod crudapp {
    use super::*;

    pub fn create_todo(
        ctx: Context<CreateTodo>,
        title: String,
        body: String,
        is_done: bool
    ) -> Result<()> {
        let add_todo = &mut ctx.accounts.todo_entry;
        add_todo.owner = ctx.accounts.user.key();
        add_todo.title = title;
        add_todo.body = body;
        add_todo.is_done = is_done;
        Ok(())
    }

    pub fn update_todo(
        ctx: Context<UpdateTodo>,
        _title: String,
        body: String,
        is_done: bool
    ) -> Result<()> {
        let update_todo = &mut ctx.accounts.todo_update;
        update_todo.body = body;
        update_todo.is_done = is_done;
        Ok(())
    }

    pub fn delete_todo(_ctx: Context<DeleteTodo>) -> Result<()> {
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct TodoEntry { // struct for the input data
    pub owner: Pubkey,

    #[max_len(25)]
    pub title: String,

    #[max_len(50)]
    pub body: String,

    pub is_done: bool,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateTodo<'info> { // struct for the account creation
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        space = ANCHOR_DISCRIMINANT_SIZE + TodoEntry::INIT_SPACE,
        seeds = [title.as_bytes(), user.key().as_ref()],
        bump
    )]
    pub todo_entry: Account<'info, TodoEntry>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct UpdateTodo<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        realloc = ANCHOR_DISCRIMINANT_SIZE + TodoEntry::INIT_SPACE,
        realloc::payer = user, 
        realloc::zero = true, // memory allocation need to be zeroed out because it is a modification account
        seeds = [title.as_bytes(), user.key().as_ref()],
        bump
    )]
    pub todo_update: Account<'info, TodoEntry>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct DeleteTodo<'info> {
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds=[title.as_bytes(),user.key().as_ref()],
        bump,
        close=user
    )]
    pub todo_delete: Account<'info, TodoEntry>,

    pub system_program: Program<'info, System>,
}
